import type { ClientMessage } from "../../../net/protocol/client/client-message";
import type { Incoming } from "../../../net/protocol/incoming";
import { Token } from "../../../utils/token";
import { serviceLocator } from "../../server/service-locator";
import type { Player } from "../player/player";
import { EmoteCore } from "./emote.core";

export class EmoteIncoming implements Incoming {
	public async handle(
		player: Player,
		clientMessage: ClientMessage,
	): Promise<void> {
		try {
			const token: Token = serviceLocator.get<Token>(Token);
			if (!token.verify(player, clientMessage.getString())) {
				return;
			}

			const emote = clientMessage.getInt16();
			new EmoteCore(player, emote).send();
		} catch (error) {
			player.disconnect();
		}
	}
}
