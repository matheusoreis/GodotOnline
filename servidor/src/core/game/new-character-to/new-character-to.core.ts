import type { Character } from "../character/character";
import type { Player } from "../player/player";
import { NewCharacterToOutgoing } from "./new-character-to.outgoing";

export class NewCharacterToCore {
	constructor(player: Player, character: Character, world: number) {
		this.player = player;
		this.character = character;
		this.world = world;
	}

	public readonly player: Player;
	public readonly character: Character;
	public readonly world: number;

	public send(): void {
		new NewCharacterToOutgoing(this.character).sendToWorldExcept(
			this.world,
			this.player,
		);
	}
}
