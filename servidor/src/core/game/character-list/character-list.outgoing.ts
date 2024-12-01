import { ServerHeaders } from "../../../net/protocol/server/server-headers";
import { ServerMessage } from "../../../net/protocol/server/server-message";
import type { Character } from "../character/character";

export class CharacterListOutgoing extends ServerMessage {
	constructor(characters: Character[], maxSlots: number) {
		super(ServerHeaders.CharacterList);

		this.putInt8(characters.length);
		this.putInt8(maxSlots);

		for (const character of characters) {
			this.putInt32(character.id);
			this.putString(character.name);
			this.putString(character.gender.name);
			this.putInt32(character.world);
			this.putInt8(character.direction);
			this.putInt32(character.position.x);
			this.putInt32(character.position.y);
			this.putString(character.sprite);
		}
	}
}
