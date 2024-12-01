import type { ClientMessage } from "../../../net/protocol/client/client-message";
import type { Incoming } from "../../../net/protocol/incoming";
import { Token } from "../../../utils/token";
import { serviceLocator } from "../../server/service-locator";
import type { Player } from "../player/player";
import { DeleteCharacterCore } from "./delete-character.core";

export class DeleteCharacterIncoming implements Incoming {
	public async handle(
		player: Player,
		clientMessage: ClientMessage,
	): Promise<void> {
		const token: Token = serviceLocator.get<Token>(Token);
		if (!token.verify(player, clientMessage.getString())) {
			return;
		}

		const id: number = clientMessage.getInt32();

		await new DeleteCharacterCore(player, id).delete();
	}
}
