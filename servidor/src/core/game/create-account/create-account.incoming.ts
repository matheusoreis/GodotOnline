import type { ClientMessage } from "../../../net/protocol/client/client-message";
import type { Incoming } from "../../../net/protocol/incoming";
import type { Player } from "../player/player";
import {
	CreateAccountCore,
	type CreateAccountParams,
} from "./create-account.core";

export class CreateAccountIncoming implements Incoming {
	public async handle(
		player: Player,
		clientMessage: ClientMessage,
	): Promise<void> {
		const params: CreateAccountParams = {
			email: clientMessage.getString(),
			password: clientMessage.getString(),
			rePassword: clientMessage.getString(),
			major: clientMessage.getInt16(),
			minor: clientMessage.getInt16(),
			revision: clientMessage.getInt16(),
		};

		await new CreateAccountCore(player, params).create();
	}
}
