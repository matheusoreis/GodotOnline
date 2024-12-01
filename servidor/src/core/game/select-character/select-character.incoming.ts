import type { ClientMessage } from "../../../net/protocol/client/client-message";
import type { Incoming } from "../../../net/protocol/incoming";
import { Logger } from "../../../utils/logger";
import { Token } from "../../../utils/token";
import { serviceLocator } from "../../server/service-locator";
import { AlertCore } from "../alert/alert.core";
import type { Character } from "../character/character";
import type { Player } from "../player/player";
import type { WorldCore } from "../world/world.core";

export class SelectCharacterIncoming implements Incoming {
	constructor() {
		this.logger = serviceLocator.get<Logger>(Logger);
	}

	logger: Logger;

	public async handle(
		player: Player,
		clientMessage: ClientMessage,
	): Promise<void> {
		const token: Token = serviceLocator.get<Token>(Token);
		if (!token.verify(player, clientMessage.getString())) {
			return;
		}

		const id: number = clientMessage.getInt32();

		try {
			player.setCharacterInUseById(id);
		} catch (error) {
			new AlertCore(
				player,
				"Personagem não encontrado ou não pôde ser definido como ativo!",
				true,
			).send();

			this.logger.error(`${error}`);
			return;
		}

		const charInUse: Character | undefined = player.getCharacterInUse();
		if (!charInUse) {
			new AlertCore(
				player,
				"Personagem não encontrado ou não pôde ser definido como ativo!",
				true,
			).send();
			return;
		}

		const world: WorldCore | undefined = charInUse.findWorld(charInUse.world);
		if (!world) {
			new AlertCore(player, "Mundo não encontrado!").send();

			return;
		}

		world.addCharacter(player, charInUse);
	}
}
