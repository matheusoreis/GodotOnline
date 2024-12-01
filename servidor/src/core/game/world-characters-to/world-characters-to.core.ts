import type { Character } from "../character/character";
import type { Player } from "../player/player";
import { MapCharactersToOutgoing } from "./world-characters-to.outgoing";

export class WorldCharactersToCore {
	constructor(player: Player, characters: Character[]) {
		this.player = player;
		this.characters = characters;
	}

	public readonly player: Player;
	public readonly characters: Character[];

	public send(): void {
		new MapCharactersToOutgoing(this.characters).sendTo(this.player);
	}
}
