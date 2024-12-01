import { ServerHeaders } from "../../../net/protocol/server/server-headers";
import { ServerMessage } from "../../../net/protocol/server/server-message";

export class CreateAccountOutgoing extends ServerMessage {
	constructor() {
		super(ServerHeaders.CreateAccount);
	}
}
