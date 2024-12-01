import { PrismaClient } from "@prisma/client";
import { Logger } from "../../../utils/logger";
import { serviceLocator } from "../../server/service-locator";
import { Vector2 } from "../../server/vector2";
import { AlertCore } from "../alert/alert.core";
import { Character } from "../character/character";
import type { Player } from "../player/player";
import { CreateCharacterOutgoing } from "./create-character.outgoing";

export type CreateCharacterParams = {
	name: string;
	gender: number;
	sprite: string;
};

export class CreateCharacterCore {
	constructor(player: Player, params: CreateCharacterParams) {
		this.player = player;
		this.name = params.name;
		this.gender = params.gender;
		this.sprite = params.sprite;

		this.prisma = serviceLocator.get<PrismaClient>(PrismaClient);
		this.logger = serviceLocator.get<Logger>(Logger);
	}

	public readonly name: string;
	public readonly gender: number;
	public readonly sprite: string;

	public readonly player: Player;
	private readonly prisma: PrismaClient;
	private readonly logger: Logger;

	public async create(): Promise<void> {
		const accountId: number | undefined = this.player.getDatabaseId();
		if (accountId === undefined) {
			new AlertCore(
				this.player,
				"Ocorreu um erro ao recuperar seus dados.",
			).send();
			this.player.disconnect();

			return;
		}

		try {
			const existingCharacter = await this.prisma.characters.findUnique({
				where: { name: this.name },
			});

			if (existingCharacter) {
				new AlertCore(this.player, "Nome do personagem já em uso.").send();
				return;
			}

			const gender = await this.prisma.genders.findUnique({
				where: { id: this.gender },
			});

			if (!gender) {
				new AlertCore(this.player, "O gênero informado não é válido!").send();

				return;
			}

			const newCharacter = await this.prisma.characters.create({
				data: {
					name: this.name,
					gendersId: this.gender,
					worldsId: 1,
					sprite: this.sprite,
					accountsId: accountId,
				},
				include: { gender: true },
			});

			const character = new Character(
				newCharacter.id,
				this.player,
				newCharacter.name,
				newCharacter.gender,
				newCharacter.sprite,
				newCharacter.worldsId,
				new Vector2(newCharacter.positionX, newCharacter.positionY),
				newCharacter.direction,
			);

			this.player.addCharacter(character);
			new AlertCore(this.player, "Personagem criado com sucesso!").send();

			new CreateCharacterOutgoing().sendTo(this.player);
		} catch (error) {
			this.logger.error(`Erro ao criar o personagem: ${error}`);
		}
	}
}
