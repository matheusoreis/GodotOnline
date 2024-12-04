import { AccessAccountIncoming } from "../core/game/access-account/access-account.incoming";
import { CharacterDataIncoming } from "../core/game/character-data/chracter-data.incoming";
import { CharacterListIncoming } from "../core/game/character-list/character-list.incoming";
import { ChatIncoming } from "../core/game/chat/chat.incoming";
import { CreateAccountIncoming } from "../core/game/create-account/create-account.incoming";
import { CreateCharacterIncoming } from "../core/game/create-character/create-character.incoming";
import { DeleteCharacterIncoming } from "../core/game/delete-character/delete-character.incoming";
import { EmoteIncoming } from "../core/game/emote/emote.incoming";
import { MoveCharacterIncoming } from "../core/game/move-character/move-character.incoming";
import { PingIncoming } from "../core/game/ping/ping.incoming";
import type { Player } from "../core/game/player/player";
import { SelectCharacterIncoming } from "../core/game/select-character/select-character.incoming";
import { serviceLocator } from "../core/server/service-locator";
import { Logger } from "../utils/logger";
import { ClientHeaders } from "./protocol/client/client-headers";
import type { ClientMessage } from "./protocol/client/client-message";
import type { Incoming } from "./protocol/incoming";

type RequestHandlerMap = Partial<Record<ClientHeaders, Incoming>>;

export class Handler {
	constructor() {
		this.logger = serviceLocator.get<Logger>(Logger);

		this.requestHandlers = {};
		this.registerRequests();
	}

	private readonly logger: Logger;
	private readonly requestHandlers: RequestHandlerMap;

	public handleMessage(player: Player, message: ClientMessage): void {
		if (!player.isConnected()) {
			return;
		}

		try {
			const messageId = message.getId() as ClientHeaders;
			const handler = this.requestHandlers[messageId];

			if (!handler) {
				this.logger.error(
					`Nenhum handler registrado para o ID de mensagem: ${messageId}`,
				);

				player.disconnect();

				return;
			}

			handler.handle(player, message);
		} catch (error) {
			this.logger.error(
				"Erro ao processar mensagem! desconectando o cliente...",
			);

			player.disconnect();
		}
	}

	private registerRequests(): void {
		const ping = serviceLocator.get<PingIncoming>(PingIncoming);
		this.requestHandlers[ClientHeaders.Ping] = ping;

		const accessAccount = serviceLocator.get<AccessAccountIncoming>(
			AccessAccountIncoming,
		);
		this.requestHandlers[ClientHeaders.AccessAccount] = accessAccount;

		const createAccount = serviceLocator.get<CreateAccountIncoming>(
			CreateAccountIncoming,
		);
		this.requestHandlers[ClientHeaders.CreateAccount] = createAccount;

		const characterList = serviceLocator.get<CharacterListIncoming>(
			CharacterListIncoming,
		);
		this.requestHandlers[ClientHeaders.CharacterList] = characterList;

		const createCharacter = serviceLocator.get<CreateCharacterIncoming>(
			CreateCharacterIncoming,
		);
		this.requestHandlers[ClientHeaders.CreateCharacter] = createCharacter;

		const deleteCharacter = serviceLocator.get<DeleteCharacterIncoming>(
			DeleteCharacterIncoming,
		);
		this.requestHandlers[ClientHeaders.DeleteCharacter] = deleteCharacter;

		const selectCharacter = serviceLocator.get<SelectCharacterIncoming>(
			SelectCharacterIncoming,
		);
		this.requestHandlers[ClientHeaders.SelectCharacter] = selectCharacter;

		const moveCharacter = serviceLocator.get<MoveCharacterIncoming>(
			MoveCharacterIncoming,
		);
		this.requestHandlers[ClientHeaders.MoveCharacter] = moveCharacter;

		const chat = serviceLocator.get<ChatIncoming>(ChatIncoming);
		this.requestHandlers[ClientHeaders.ChatMessage] = chat;

		const emote = serviceLocator.get<EmoteIncoming>(EmoteIncoming);
		this.requestHandlers[ClientHeaders.EmoteMessage] = emote;

		const characterData = serviceLocator.get<CharacterDataIncoming>(
			CharacterDataIncoming,
		);
		this.requestHandlers[ClientHeaders.CharacterData] = characterData;
	}
}
