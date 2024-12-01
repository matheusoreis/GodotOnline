import type { Player } from "../../core/game/player/player";
import { Memory } from "../../core/server/memory";
import { serviceLocator } from "../../core/server/service-locator";
import { Logger } from "../../utils/logger";
import type { ServerMessage } from "./server/server-message";

export abstract class Outgoing {
	constructor() {
		this.logger = serviceLocator.get<Logger>(Logger);
		this.memory = serviceLocator.get<Memory>(Memory);
	}

	private logger: Logger;
	private memory: Memory;

	protected dataTo(player: Player, message: ServerMessage): void {
		try {
			player.ws.send(message.getBuffer());
		} catch (error) {
			this.logger.error(`Error sending data to the client! Error: ${error}`);
		}
	}

	protected dataToAll(message: ServerMessage): void {
		for (const index of this.memory.players.getFilledSlots()) {
			const players = this.memory.players.get(index);
			if (players?.ws) {
				try {
					this.dataTo(players, message);
				} catch (error) {
					this.logger.error(
						`Error sending data to the client! Error: ${error}`,
					);
				}
			}
		}
	}

	protected dataToAllExcept(except: Player, message: ServerMessage): void {
		for (const index of this.memory.players.getFilledSlots()) {
			const players = this.memory.players.get(index);
			if (players?.ws && players !== except) {
				try {
					this.dataTo(players, message);
				} catch (error) {
					this.logger.error(
						`Error sending data to the client! Error: ${error}`,
					);
				}
			}
		}
	}

	protected dataToWorld(worldId: number, message: ServerMessage): void {
		for (const index of this.memory.players.getFilledSlots()) {
			const players = this.memory.players.get(index);
			if (players?.getCharacterInUse()?.world === worldId) {
				try {
					this.dataTo(players, message);
				} catch (error) {
					this.logger.error(
						`Error sending data to the map clients! Error: ${error}`,
					);
				}
			}
		}
	}

	protected dataToWorldExcept(
		worldId: number,
		except: Player,
		message: ServerMessage,
	): void {
		for (const index of this.memory.players.getFilledSlots()) {
			const players = this.memory.players.get(index);
			if (
				players?.ws &&
				players !== except &&
				players.getCharacterInUse()?.world === worldId
			) {
				try {
					this.dataTo(players, message);
				} catch (error) {
					this.logger.error(
						`Error sending data to the map clients! Error: ${error}`,
					);
				}
			}
		}
	}

	// private sendMessage(player: Player, message: ServerMessage): void {
	// 	try {
	// 		player.ws.send(message.getBuffer());
	// 	} catch (error) {
	// 		this.logger.error(
	// 			`Erro ao enviar o pacote para o cliente! Error: ${error}`,
	// 		);
	// 	}
	// }

	// private sendToPlayers(
	// 	message: ServerMessage,
	// 	exceptPlayer?: Player,
	// 	world?: number,
	// ): void {
	// 	for (const index of this.memory.connections.getFilledSlots()) {
	// 		const player = this.memory.connections.get(index);
	// 		if (
	// 			player &&
	// 			(!exceptPlayer || player !== exceptPlayer) &&
	// 			(!world || player.getCharacterInUse()?.world === world)
	// 		) {
	// 			this.sendMessage(player, message);
	// 		}
	// 	}
	// }

	// protected dataTo(player: Player, message: ServerMessage): void {
	// 	this.sendMessage(player, message);
	// }

	// protected dataToAll(message: ServerMessage): void {
	// 	this.sendToPlayers(message);
	// }

	// protected dataToAllExcept(
	// 	exceptPlayer: Player,
	// 	message: ServerMessage,
	// ): void {
	// 	this.sendToPlayers(message, exceptPlayer);
	// }

	// protected dataToWorld(world: number, message: ServerMessage): void {
	// 	this.sendToPlayers(message, undefined, world);
	// }

	// protected dataToWorldExcept(
	// 	world: number,
	// 	exceptPlayer: Player,
	// 	message: ServerMessage,
	// ): void {
	// 	this.sendToPlayers(message, exceptPlayer, world);
	// }
}
