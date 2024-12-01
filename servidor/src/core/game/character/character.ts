import { PrismaClient, type Genders } from "@prisma/client";
import { CHARACTER_LOOP } from "../../../data/constants";
import { Logger } from "../../../utils/logger";
import { Memory } from "../../server/memory";
import { serviceLocator } from "../../server/service-locator";
import type { Slots } from "../../server/slots";
import type { Vector2 } from "../../server/vector2";
import type { Player } from "../player/player";
import type { WorldCore } from "../world/world.core";

export class Character {
	constructor(
		id: number,
		player: Player,
		name: string,
		gender: Genders,
		sprite: string,
		world: number,
		position: Vector2,
		direction: number,
	) {
		this.id = id;
		this.player = player;
		this.name = name;
		this.gender = gender;
		this.sprite = sprite;
		this.world = world;
		this.position = position;
		this.direction = direction;

		this.prisma = serviceLocator.get<PrismaClient>(PrismaClient);
		this.logger = serviceLocator.get<Logger>(Logger);
		this.memory = serviceLocator.get<Memory>(Memory);
	}

	public readonly id: number;
	private readonly player: Player;
	public readonly name: string;
	public readonly gender: Genders;
	public readonly sprite: string;
	public readonly world: number;
	public position: Vector2;
	public direction: number;

	private prisma: PrismaClient;
	private logger: Logger;
	private memory: Memory;

	private loopInterval: Timer | null = null;

	public async update(character: Character): Promise<void> {
		try {
			await this.prisma.characters.update({
				where: { id: character.id },
				data: {
					name: character.name,
					worldsId: character.world,
					direction: character.direction,
					positionX: character.position.x,
					positionY: character.position.y,
					updatedAt: new Date(),
				},
			});

			this.logger.info(`${character.name} atualizado com sucesso!`);
		} catch (error) {
			this.logger.info(`Erro ao atualizar o personagem: ${error}`);
		}
	}

	public findWorld(worldId: number): WorldCore | undefined {
		const slots: Slots<WorldCore> = this.memory.worlds;

		const world = Array.from(slots.getFilledSlots())
			.map((index) => slots.get(index))
			.find((world) => world?.id === worldId);

		return world;
	}

	public async startloop(): Promise<void> {
		this.loopInterval = setInterval(
			async () => {
				try {
					await this.update(this);
				} catch (error) {
					console.error(
						"Erro ao sincronizar os personagens com o banco de dados: ",
						error,
					);
				}
			},
			CHARACTER_LOOP * 60 * 1000,
		);
	}

	public stopLoop(): void {
		if (this.loopInterval === null) {
			return;
		}

		clearInterval(this.loopInterval);
		this.loopInterval = null;
	}

	public disconnect(): void {
		this.player.disconnect();
	}
}
