import { PrismaClient, type Worlds } from "@prisma/client";
import { Logger } from "../../utils/logger";
import { Memory } from "./memory";
import { serviceLocator } from "./service-locator";
import { WorldCore } from "../game/world/world.core";
import { Vector2 } from "./vector2";

export class LoadMemory {
	constructor() {
		this.logger = serviceLocator.get<Logger>(Logger);
		this.prisma = serviceLocator.get<PrismaClient>(PrismaClient);
		this.memory = serviceLocator.get<Memory>(Memory);
	}

	private readonly logger: Logger;
	private readonly prisma: PrismaClient;
	private readonly memory: Memory;

	public async loadWorlds(): Promise<void> {
		try {
			const worlds: Worlds[] | null = await this.prisma.worlds.findMany();

			if (worlds.length === 0) {
				this.logger.error("Nenhum mundo encontrado no banco de dados.");
				return;
			}

			for (const world of worlds) {
				this.memory.worlds.add(
					new WorldCore(
						world.id,
						world.name,
						new Vector2(world.sizeX, world.sizeY),
					),
				);
			}

			this.logger.info(`${worlds.length} mundos carregados na memória.`);
		} catch (error) {
			this.logger.error(
				`Falha ao carregar os mundos do banco de dados, erro: ${error}`,
			);
		}
	}
}
