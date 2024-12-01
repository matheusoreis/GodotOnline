import type { ClientMessage } from "../../../net/protocol/client/client-message";
import type { Incoming } from "../../../net/protocol/incoming";
import { Token } from "../../../utils/token";
import { serviceLocator } from "../../server/service-locator";
import type { Player } from "../player/player";
import {
	CreateCharacterCore,
	type CreateCharacterParams,
} from "./create-character.core";

export class CreateCharacterIncoming implements Incoming {
	public async handle(
		player: Player,
		clientMessage: ClientMessage,
	): Promise<void> {
		const token: Token = serviceLocator.get<Token>(Token);
		if (!token.verify(player, clientMessage.getString())) {
			return;
		}

		const params: CreateCharacterParams = {
			name: clientMessage.getString(),
			gender: clientMessage.getInt8(),
			sprite: clientMessage.getString(),
		};

		await new CreateCharacterCore(player, params).create();
	}
}
