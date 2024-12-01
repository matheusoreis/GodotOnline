import { type Prisma, PrismaClient } from "@prisma/client";
import { Logger } from "../../../utils/logger";
import { serviceLocator } from "../../server/service-locator";
import { Vector2 } from "../../server/vector2";
import { AlertCore } from "../alert/alert.core";
import { Character } from "../character/character";
import type { Player } from "../player/player";
import { CharacterListOutgoing } from "./character-list.outgoing";

export class CharacterListCore {
	constructor(player: Player) {
		this.player = player;

		this.prisma = serviceLocator.get<PrismaClient>(PrismaClient);
		this.logger = serviceLocator.get<Logger>(Logger);
	}

	public readonly player: Player;
	private readonly prisma: PrismaClient;
	private readonly logger: Logger;

	public async send(): Promise<void> {
		const accountId: number | undefined = this.player.getDatabaseId();

		if (accountId === undefined) {
			new AlertCore(
				this.player,
				"Ocorreu um erro ao recuperar seus dados.",
				true,
			).send();

			return;
		}

		try {
			const account = await this.prisma.accounts.findUnique({
				where: { id: accountId },
				include: {
					characters: {
						include: {
							gender: true,
						},
					},
				},
			});

			if (!account) {
				new AlertCore(
					this.player,
					"A conta informada não foi encontrada!",
					true,
				).send();

				return;
			}

			const characters: Character[] = account.characters.map((c) => {
				return new Character(
					c.id,
					this.player,
					c.name,
					c.gender,
					c.sprite,
					c.worldsId,
					new Vector2(c.positionX, c.positionY),
					c.direction,
				);
			});

			this.player.addCharacters(characters);

			new CharacterListOutgoing(characters, account.slots).sendTo(this.player);
		} catch (error) {
			new AlertCore(this.player, `Error: ${error}`, true).send();
			this.logger.error(`${error}`);
		}
	}
}
