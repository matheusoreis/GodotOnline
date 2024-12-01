import { Logger } from "../../../utils/logger";
import { serviceLocator } from "../../server/service-locator";
import type { Vector2 } from "../../server/vector2";
import { AlertCore } from "../alert/alert.core";
import type { Player } from "../player/player";

export type MoveCharacterParams = {
	action: number;
	position: Vector2;
	direction: number;
};

export class MoveCharacterCore {
	constructor(player: Player, params: MoveCharacterParams) {
		this.player = player;
		this.action = params.action;
		this.position = params.position;
		this.direction = params.direction;

		this.logger = serviceLocator.get<Logger>(Logger);
	}

	public readonly player: Player;
	public readonly action: number;
	public readonly position: Vector2;
	public readonly direction: number;
	private logger: Logger;

	public async send(): Promise<void> {
		const character = this.player.getCharacterInUse();
		if (!character) {
			new AlertCore(
				this.player,
				"Personagem não encontrado ou não pôde ser definido como ativo!",
			).send();

			return;
		}

		const world = character.findWorld(character.world);
		if (!world) {
			new AlertCore(this.player, "Mundo não encontrado!").send();

			return;
		}

		world.moveCharacter(
			this.player,
			character,
			this.action,
			this.position,
			this.direction,
		);
	}
}
