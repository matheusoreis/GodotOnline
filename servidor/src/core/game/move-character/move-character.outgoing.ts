import { ServerHeaders } from "../../../net/protocol/server/server-headers";
import { ServerMessage } from "../../../net/protocol/server/server-message";
import type { Vector2 } from "../../server/vector2";
import type { Character } from "../character/character";

export class MoveCharacterToOthersOutgoing extends ServerMessage {
	constructor(
		character: Character,
		action: number,
		position: Vector2,
		direction: number,
	) {
		super(ServerHeaders.MoveCharacter);

		this.putInt32(character.id);
		this.putInt32(character.world);
		this.putInt8(action);
		this.putInt8(direction);
		this.putInt32(position.x);
		this.putInt32(position.y);
	}
}

export class BlockCharacterMovementOutgoing extends ServerMessage {
	constructor(character: Character) {
		super(ServerHeaders.BlockCharacterMovement);

		this.putInt32(character.id);
		this.putInt32(character.world);
	}
}
