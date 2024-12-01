import type { ClientMessage } from "../../../net/protocol/client/client-message";
import type { Incoming } from "../../../net/protocol/incoming";
import { Token } from "../../../utils/token";
import { serviceLocator } from "../../server/service-locator";
import { AlertCore } from "../alert/alert.core";
import type { Player } from "../player/player";
import { ChatChannel, ChatCore, type ChatParams } from "./chat.core";

export class ChatIncoming implements Incoming {
	public async handle(
		player: Player,
		clientMessage: ClientMessage,
	): Promise<void> {
		const token: Token = serviceLocator.get<Token>(Token);
		if (!token.verify(player, clientMessage.getString())) {
			return;
		}

		const params: ChatParams = {
			channel: clientMessage.getInt8(),
			message: clientMessage.getString(),
		};

		if (params.channel < 0 || params.channel > ChatChannel.GLOBAL) {
			player.disconnect();

			return;
		}

		if (!this.isValidMessage(params.message)) {
			player.disconnect();

			return;
		}

		if (params.channel === ChatChannel.MAP) {
			const character = player.getCharacterInUse();
			if (!character) {
				new AlertCore(
					player,
					"Personagem não encontrado ou não pôde ser definido como ativo!",
				).send();

				return;
			}

			new ChatCore(player, params.channel, params.message).mapMessage(
				character.world,
			);
		} else if (params.channel === ChatChannel.GLOBAL) {
			new ChatCore(player, params.channel, params.message).globalMessage();
		}
	}

	private isValidMessage(message: string): boolean {
		return (
			message.length > 0 && /^[\p{L}\p{M}\p{Z}\p{S}\p{P}\p{N}]+$/u.test(message)
		);
	}
}
