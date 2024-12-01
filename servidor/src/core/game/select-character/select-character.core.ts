import type { Character } from "../character/character";
import type { Player } from "../player/player";
import { SelectCharacterOutgoing } from "./select-character.outgoing";

export class SelectCharacterCore {
	constructor(player: Player, character: Character) {
		this.player = player;
		this.character = character;
	}

	public readonly player: Player;
	public readonly character: Character;

	public send(): void {
		new SelectCharacterOutgoing(this.character).sendTo(this.player);
	}
}
