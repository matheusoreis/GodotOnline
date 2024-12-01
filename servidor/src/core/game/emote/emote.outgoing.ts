import { ServerHeaders } from "../../../net/protocol/server/server-headers";
import { ServerMessage } from "../../../net/protocol/server/server-message";

export class EmoteOutgoing extends ServerMessage {
	constructor(emote: number) {
		super(ServerHeaders.EmoteMessage);

		this.putInt16(emote);
	}
}
