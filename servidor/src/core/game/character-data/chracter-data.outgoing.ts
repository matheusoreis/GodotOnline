import { ServerHeaders } from "../../../net/protocol/server/server-headers";
import { ServerMessage } from "../../../net/protocol/server/server-message";
import type { Character } from "../character/character";

export class CharacterDataOutgoing extends ServerMessage {
	constructor(character: Character) {
		super(ServerHeaders.CharacterData);

		this.putString(character.name);
		this.putString(character.gender.name);
	}
}
