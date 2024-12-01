import type { ServerWebSocket } from "bun";
import { AlertCore } from "../core/game/alert/alert.core";
import type { Character } from "../core/game/character/character";
import { Player } from "../core/game/player/player";
import { Memory } from "../core/server/memory";
import { serviceLocator } from "../core/server/service-locator";
import { Logger } from "../utils/logger";
import { NotificationCore } from "../core/game/notification/notification.core";

export class Manager {
	constructor() {
		this.logger = serviceLocator.get<Logger>(Logger);
		this.memory = serviceLocator.get<Memory>(Memory);
	}

	private readonly logger: Logger;
	private readonly memory: Memory;

	public websocketOpen(ws: ServerWebSocket): void {
		const firstAvailableId: number | undefined =
			this.memory.players.getFirstEmptySlot();

		if (firstAvailableId === undefined) {
			this.handleFullServer(ws);

			return;
		}

		const player: Player = new Player(ws, firstAvailableId);
		player.addToMemory();

		new NotificationCore(player, "Conectado ao servidor.").send();
	}

	public async websocketClose(ws: ServerWebSocket): Promise<void> {
		const player: Player | undefined = this.getSocket(ws);

		if (!player) {
			return;
		}

		const characterInUse: Character | undefined = player.getCharacterInUse();

		if (!characterInUse) {
			return;
		}

		await this.updateCharacterBeforeDisconnect(characterInUse);
		await this.removeCharacterFromCurrentWorld(player, characterInUse);

		characterInUse.stopLoop();
		this.cleanupPlayer(ws);
	}

	public websocketMessage(ws: ServerWebSocket, message: Uint8Array): void {
		const player: Player | undefined = this.getSocket(ws);

		if (!player) {
			this.cleanupPlayer(ws);
			return;
		}

		player.handleMessage(message);
	}

	private handleFullServer(ws: ServerWebSocket): void {
		const player: Player = new Player(ws, -1);

		this.logger.info(
			`O servidor está cheio, desconectando o cliente: ${ws.remoteAddress}`,
		);

		new AlertCore(
			player,
			"O servidor está cheio, tente novamente mais tarde!",
		).send();
	}

	private async updateCharacterBeforeDisconnect(
		characterInUse: Character,
	): Promise<void> {
		try {
			await characterInUse.update(characterInUse);

			this.logger.info(
				`Personagem ${characterInUse.name} atualizado ao desconectar.`,
			);
		} catch (error) {
			// TODO: Verificar a integridade disso
			throw new Error(`Falha ao atualizar personagem, erro: ${error}`);
		}
	}

	private async removeCharacterFromCurrentWorld(
		player: Player,
		characterInUse: Character,
	): Promise<void> {
		try {
			const foundWorld = characterInUse.findWorld(characterInUse.world);
			if (!foundWorld) {
				new AlertCore(player, "Mundo não encontrado!", true).send();
				return;
			}

			foundWorld.removeCharacter(player, characterInUse);
		} catch (error) {
			throw new Error(`Falha ao remover personagem do mundo, erro: ${error}`);
		}
	}

	private cleanupPlayer(ws: ServerWebSocket): void {
		const player: Player | undefined = this.getSocket(ws);

		if (!player) {
			return;
		}

		this.memory.players.remove(player.id);
		player.disconnect();
	}

	private getSocket(ws: ServerWebSocket): Player | undefined {
		for (const index of this.memory.players.getFilledSlots()) {
			const player: Player | undefined = this.memory.players.get(index);

			if (player && player.ws === ws) {
				return player;
			}
		}
		return;
	}
}
