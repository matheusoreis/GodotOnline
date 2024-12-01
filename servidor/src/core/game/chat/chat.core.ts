import type { Player } from "../player/player";
import { ChatOutgoing } from "./chat.outgoing";
import { PROFANITY_LIST } from "../../../data/constants";
import { AlertCore } from "../alert/alert.core";
import type { Character } from "../character/character";

export type ChatParams = {
	channel: number;
	message: string;
};

export enum ChatChannel {
	MAP = 0,
	GLOBAL = 1,
}

export class ChatCore {
	constructor(player: Player, channel: number, message: string) {
		this.player = player;

		this.channel = channel;
		this.message = message;
	}

	public readonly player: Player;
	public readonly channel: number;
	public readonly message: string;

	public mapMessage(worldId: number): void {
		const characterInUse = this._getCharacterInUse();

		if (!characterInUse) {
			return;
		}

		const processedMessage = this._censorProfanity(
			this.message,
			PROFANITY_LIST,
		);

		new ChatOutgoing(
			this.channel,
			processedMessage,
			characterInUse,
		).sendToWorld(worldId);
	}

	public globalMessage(): void {
		const characterInUse = this._getCharacterInUse();

		if (!characterInUse) {
			return;
		}

		const processedMessage = this._censorProfanity(
			this.message,
			PROFANITY_LIST,
		);

		new ChatOutgoing(
			this.channel,
			processedMessage,
			characterInUse,
		).sendToAll();
	}

	private _censorProfanity(input: string, profanityList: string[]): string {
		let censoredText = input;

		for (const word of profanityList) {
			const regex = new RegExp(word, "gi");
			censoredText = censoredText.replace(regex, "*".repeat(word.length));
		}

		return censoredText;
	}

	private _getCharacterInUse(): Character | undefined {
		const character = this.player.getCharacterInUse();
		if (!character) {
			new AlertCore(
				this.player,
				"Personagem não encontrado ou não pôde ser definido como ativo!",
			).send();

			return undefined;
		}

		return character;
	}
}
