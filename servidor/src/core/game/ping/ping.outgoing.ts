import { ServerHeaders } from "../../../net/protocol/server/server-headers";
import { ServerMessage } from "../../../net/protocol/server/server-message";

export class PingOutgoing extends ServerMessage {
	constructor() {
		super(ServerHeaders.Ping);
	}
}
