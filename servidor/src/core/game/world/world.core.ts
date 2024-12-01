import { DATA_DIRECTORY, WORLD_LOOP } from "../../../data/constants";
import { Logger } from "../../../utils/logger";
import { Memory } from "../../server/memory";
import { serviceLocator } from "../../server/service-locator";
import type { Slots } from "../../server/slots";
import type { Vector2 } from "../../server/vector2";
import { AlertCore } from "../alert/alert.core";
import type { Character } from "../character/character";
import {
	BlockCharacterMovementOutgoing,
	MoveCharacterToOthersOutgoing,
} from "../move-character/move-character.outgoing";
import type { Player } from "../player/player";
import { WorldOutgoing } from "./world.outgoing";
import fs from "node:fs";
import path from "node:path";

export class WorldCore {
	constructor(id: number, name: string, size: Vector2) {
		this.id = id;
		this.name = name;
		this.size = size;

		this.logger = serviceLocator.get<Logger>(Logger);
		this.memory = serviceLocator.get<Memory>(Memory);
		this.outgoing = new WorldOutgoing();
	}

	public readonly id: number;
	public readonly name: string;
	public readonly size: Vector2;
	private logger: Logger;
	private memory: Memory;
	private outgoing: WorldOutgoing;
	private loopInterval: Timer | null = null;

	public addCharacter(player: Player, character: Character): void {
		character.startloop();

		if (character.world !== this.id) {
			character.disconnect();
			new AlertCore(
				player,
				`O personagem ${character.name} não pertence ao mundo: ${this.id}`,
			).send();

			return;
		}

		// Notificar o novo personagem selecionado
		this.outgoing.sendCharacterSelected(player, character);

		// Notificar outros personagens sobre o novo personagem
		this.outgoing.sendOthersOfNewCharacter(player, character, this.id);

		// Notificar o novo personagem sobre os personagens já presentes
		this.outgoing.sendExistingCharacters(player);

		// Adicionar o personagem ao array de personagens
		this.memory.characters.add(character);
	}

	public removeCharacter(player: Player, character: Character): void {
		const slots: Slots<Character> = this.memory.characters;
		const index = Array.from(slots.getFilledSlots()).find((i) => {
			const existingCharacter = slots.get(i);
			return existingCharacter?.id === character.id;
		});

		if (index === undefined) {
			new AlertCore(
				player,
				`O personagem ${character.name} não pertence ao mundo: ${this.id}`,
			).send();

			return;
		}

		slots.remove(index);
		this.outgoing.sendDisconnectCharacter(player, character);
	}

	private loadMap() {
		const mapPath = path.join(
			__dirname,
			`${DATA_DIRECTORY}/worlds/${this.id}.json`,
		);

		if (fs.existsSync(mapPath)) {
			return JSON.parse(fs.readFileSync(mapPath, "utf-8"));
		}

		return {};
	}

	private isTileBlocked(position: Vector2): boolean {
		const map = this.loadMap();

		for (const key in map) {
			for (const tile of map[key]) {
				if (tile.x === position.x && tile.y === position.y) {
					return true;
				}
			}
		}

		return false;
	}

	public moveCharacter(
		player: Player,
		character: Character,
		action: number,
		position: Vector2,
		direction: number,
	): void {
		const existingCharacter: Character | undefined = this.getCharacterById(
			character.id,
		);

		if (!existingCharacter) {
			character.disconnect();
			new AlertCore(
				player,
				`O personagem ${character.name} não pertence ao mundo: ${this.id}`,
			).send();

			return;
		}

		if (!this.characterInWorld(character)) {
			character.disconnect();
			new AlertCore(
				player,
				`O personagem ${character.name} não pertence ao mundo: ${this.id}`,
			).send();

			return;
		}

		const tileX = Math.floor(position.x / 32);
		const tileY = Math.floor(position.y / 32);

		if (this.isTileBlocked({ x: tileX, y: tileY })) {
			new BlockCharacterMovementOutgoing(character).sendTo(player);

			return;
		}

		character.position = position;
		character.direction = direction;

		new MoveCharacterToOthersOutgoing(
			character,
			action,
			position,
			direction,
		).sendToWorldExcept(this.id, player);
	}

	public getCharacterById(id: number): Character | undefined {
		return this.findCharacter((c) => c.id === id);
	}

	public getCharacterByName(name: string): Character | undefined {
		return this.findCharacter((c) => c.name === name);
	}

	public characterInWorld(character: Character): boolean {
		const existingCharacter = this.findCharacter((c) => c.id === character?.id);

		const isCharacterInWorld: boolean = existingCharacter
			? existingCharacter.world === this.id
			: false;

		return isCharacterInWorld;
	}

	public async startLoop(): Promise<void> {
		this.loopInterval = setInterval(
			async () => {
				//
			},
			WORLD_LOOP * 60 * 1000,
		);
	}

	public stopLoop(): void {
		if (this.loopInterval !== null) {
			clearInterval(this.loopInterval);
			this.loopInterval = null;
		}
	}

	private findCharacter(
		predicate: (character: Character) => boolean,
	): Character | undefined {
		const slots: Slots<Character> = this.memory.characters;
		return slots.find(predicate);
	}
}
