import { ServerHeaders } from "../../../net/protocol/server/server-headers";
import { ServerMessage } from "../../../net/protocol/server/server-message";
import type { Character } from "../character/character";

export class SelectCharacterOutgoing extends ServerMessage {
	constructor(character: Character) {
		super(ServerHeaders.SelectCharacter);

		this.putInt32(character.id);
		this.putString(character.name);
		this.putInt32(character.world);
		this.putInt8(character.direction);
		this.putInt32(character.position.x);
		this.putInt32(character.position.y);
		this.putString(character.sprite);
	}
}
