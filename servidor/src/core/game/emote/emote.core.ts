import type { Player } from "../player/player";
import { EmoteOutgoing } from "./emote.outgoing";
import { AlertCore } from "../alert/alert.core";

export class EmoteCore {
	constructor(player: Player, emote: number) {
		this.player = player;
		this.emote = emote;
	}

	public readonly player: Player;
	public readonly emote: number;

	public send(): void {
		const character = this.player.getCharacterInUse();
		if (!character) {
			new AlertCore(
				this.player,
				"Personagem não encontrado ou não pôde ser definido como ativo!",
			).send();

			return;
		}

		new EmoteOutgoing(this.emote).sendToWorld(character.id);
	}
}
