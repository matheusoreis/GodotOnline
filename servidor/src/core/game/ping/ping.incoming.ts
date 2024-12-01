import type { Incoming } from "../../../net/protocol/incoming";
import type { Player } from "../player/player";
import { PingCore } from "./ping.core";

export class PingIncoming implements Incoming {
	handle(player: Player): void {
		new PingCore().sendPing(player);
	}
}
