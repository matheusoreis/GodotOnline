import type { Player } from "../player/player";
import { PingOutgoing } from "./ping.outgoing";

export class PingCore {
	public sendPing(player: Player): void {
		new PingOutgoing().sendTo(player);
	}
}
