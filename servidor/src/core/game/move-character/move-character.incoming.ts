import type { ClientMessage } from "../../../net/protocol/client/client-message";
import type { Incoming } from "../../../net/protocol/incoming";
import { Token } from "../../../utils/token";
import { serviceLocator } from "../../server/service-locator";
import { Vector2 } from "../../server/vector2";
import type { Player } from "../player/player";
import {
	MoveCharacterCore,
	type MoveCharacterParams,
} from "./move-character.core";

export class MoveCharacterIncoming implements Incoming {
	public async handle(
		player: Player,
		clientMessage: ClientMessage,
	): Promise<void> {
		const token: Token = serviceLocator.get<Token>(Token);
		if (!token.verify(player, clientMessage.getString())) {
			return;
		}

		const params: MoveCharacterParams = {
			action: clientMessage.getInt8(),
			direction: clientMessage.getInt8(),
			position: new Vector2(clientMessage.getInt32(), clientMessage.getInt32()),
		};

		await new MoveCharacterCore(player, params).send();
	}
}
