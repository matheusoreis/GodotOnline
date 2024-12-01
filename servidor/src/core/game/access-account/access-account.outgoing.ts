import { ServerHeaders } from "../../../net/protocol/server/server-headers";
import { ServerMessage } from "../../../net/protocol/server/server-message";

export class AccessAccountOutgoing extends ServerMessage {
	constructor(token: string) {
		super(ServerHeaders.AccessAccount);

		this.putString(token);
	}
}
