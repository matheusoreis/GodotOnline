import type { ClientMessage } from "../../../net/protocol/client/client-message";
import type { Incoming } from "../../../net/protocol/incoming";
import type { Player } from "../player/player";
import {
	AccessAccountCore,
	type AccessAccountParams,
} from "./access-account.core";

export class AccessAccountIncoming implements Incoming {
	public async handle(
		player: Player,
		clientMessage: ClientMessage,
	): Promise<void> {
		const params: AccessAccountParams = {
			email: clientMessage.getString(),
			password: clientMessage.getString(),
			major: clientMessage.getInt16(),
			minor: clientMessage.getInt16(),
			revision: clientMessage.getInt16(),
		};

		await new AccessAccountCore(player, params).access();
	}
}
