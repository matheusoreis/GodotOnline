import { ServerHeaders } from "../../../net/protocol/server/server-headers";
import { ServerMessage } from "../../../net/protocol/server/server-message";

export class NotificationOutgoing extends ServerMessage {
	constructor(message: string) {
		super(ServerHeaders.Alert);
		this.putString(message);
	}
}
