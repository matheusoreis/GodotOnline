import { type Prisma, PrismaClient } from "@prisma/client";
import { Logger } from "../../../utils/logger";
import { serviceLocator } from "../../server/service-locator";
import { Vector2 } from "../../server/vector2";
import { AlertCore } from "../alert/alert.core";
import { Character } from "../character/character";
import type { Player } from "../player/player";
import { CharacterDataOutgoing } from "./chracter-data.outgoing";

export class CharacterDataCore {
	constructor(player: Player) {
		this.player = player;

		this.prisma = serviceLocator.get<PrismaClient>(PrismaClient);
		this.logger = serviceLocator.get<Logger>(Logger);
	}

	public readonly player: Player;
	private readonly prisma: PrismaClient;
	private readonly logger: Logger;

	public async send(): Promise<void> {
        const characterInUse = this._getCharacterInUse();
		new CharacterDataOutgoing(characterInUse!).sendTo(this.player);
	}

    private _getCharacterInUse(): Character | undefined {
		const character = this.player.getCharacterInUse();
		if (!character) {
			new AlertCore(
				this.player,
				"Personagem não encontrado ou não pôde ser definido como ativo!",
			).send();

			return undefined;
		}
		return character;
	}
}
