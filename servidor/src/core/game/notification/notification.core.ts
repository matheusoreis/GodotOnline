import type { Player } from "../player/player";
import { NotificationOutgoing } from "./notification.outgoing";

export class NotificationCore {
	constructor(player: Player, message: string) {
		this.player = player;
		this.message = message;
	}

	public readonly player: Player;
	public readonly message: string;

	public send(): void {
		new NotificationOutgoing(this.message).sendTo(this.player);
	}
}
