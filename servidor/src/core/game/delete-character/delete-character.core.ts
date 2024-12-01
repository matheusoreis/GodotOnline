import { PrismaClient } from "@prisma/client";
import { Logger } from "../../../utils/logger";
import { serviceLocator } from "../../server/service-locator";
import { AlertCore } from "../alert/alert.core";
import type { Player } from "../player/player";
import { DeleteCharacterOutgoing } from "./delete-character.outgoing";

export class DeleteCharacterCore {
	constructor(player: Player, id: number) {
		this.player = player;
		this.id = id;

		this.prisma = serviceLocator.get<PrismaClient>(PrismaClient);
		this.logger = serviceLocator.get<Logger>(Logger);
	}

	public readonly id: number;
	public readonly player: Player;
	private readonly prisma: PrismaClient;
	private readonly logger: Logger;

	public async delete(): Promise<void> {
		const accountId = this.player.getDatabaseId();
		if (accountId === undefined) {
			new AlertCore(
				this.player,
				"Ocorreu um erro ao recuperar seus dados!",
			).send();

			return;
		}

		try {
			const character = await this.prisma.characters.findUnique({
				where: { id: this.id },
			});

			if (!character || character.accountsId !== accountId) {
				new AlertCore(
					this.player,
					"Personagem não encontrado ou não pertence a esta conta",
				).send();

				return;
			}

			await this.prisma.characters.delete({
				where: { id: this.id },
			});

			this.player.removeCharacter(this.id);
			new AlertCore(this.player, "Personagem excluído com sucesso!").send();

			new DeleteCharacterOutgoing().sendTo(this.player);
		} catch (error) {
			this.logger.player(`Error: ${error}`);

			this.logger.error(`${error}`);
		}
	}
}
