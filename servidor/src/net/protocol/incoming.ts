import type { Player } from "../../core/game/player/player";
import type { ClientMessage } from "./client/client-message";

export interface Incoming {
	handle(player: Player, clientMessage: ClientMessage): void;
}
