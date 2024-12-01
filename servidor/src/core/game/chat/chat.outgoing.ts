import { ServerHeaders } from "../../../net/protocol/server/server-headers";
import { ServerMessage } from "../../../net/protocol/server/server-message";
import type { Character } from "../character/character";

export class ChatOutgoing extends ServerMessage {
	constructor(channel: number, message: string, sender: Character) {
		super(ServerHeaders.ChatMessage);

		this.putInt8(channel);
		this.putString(message);
		this.putString(sender.name);
	}
}
