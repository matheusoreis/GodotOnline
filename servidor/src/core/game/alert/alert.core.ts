import type { Player } from "../player/player";
import { AlertOutgoing } from "./alert.outgoing";

export class AlertCore {
	constructor(player: Player, message: string, disconnect = false) {
		this.player = player;
		this.message = message;
		this.disconnect = disconnect;
	}

	public readonly player: Player;
	public readonly message: string;
	public readonly disconnect: boolean;

	public send(): void {
		new AlertOutgoing(this.message, this.disconnect).sendTo(this.player);
	}
}
