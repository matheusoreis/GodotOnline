import { PrismaClient } from "@prisma/client";
import { ByteBuffer } from "../net/buffers/byte-buffer";
import { Handler } from "../net/handler";
import { Manager } from "../net/manager";
import { ClientMessage } from "../net/protocol/client/client-message";
import { Setup } from "../setup";
import { Logger } from "../utils/logger";
import { AccessAccountIncoming } from "./game/access-account/access-account.incoming";
import { CreateAccountIncoming } from "./game/create-account/create-account.incoming";
import { PingIncoming } from "./game/ping/ping.incoming";
import { WorldOutgoing } from "./game/world/world.outgoing";
import { Memory } from "./server/memory";
import { Password } from "./server/password";
import { serviceLocator } from "./server/service-locator";
import { CharacterListIncoming } from "./game/character-list/character-list.incoming";
import { CreateCharacterIncoming } from "./game/create-character/create-character.incoming";
import { DeleteCharacterIncoming } from "./game/delete-character/delete-character.incoming";
import { SelectCharacterIncoming } from "./game/select-character/select-character.incoming";
import { MoveCharacterIncoming } from "./game/move-character/move-character.incoming";
import { ChatIncoming } from "./game/chat/chat.incoming";
import { EmoteIncoming } from "./game/emote/emote.incoming";
import { Jwt } from "./server/jwt";
import { Token } from "../utils/token";
import { LoadMemory } from "./server/load-memory";

export class Dependency {
	public setup() {
		serviceLocator.registerFactory<Logger>(Logger, () => {
			return new Logger();
		});

		serviceLocator.registerSingleton<Memory>(Memory, new Memory());

		serviceLocator.registerFactory<ByteBuffer>(ByteBuffer, () => {
			return new ByteBuffer();
		});

		serviceLocator.registerFactory<Setup>(Setup, () => {
			return new Setup();
		});

		serviceLocator.registerFactory<Manager>(Manager, () => {
			return new Manager();
		});

		serviceLocator.registerFactory<Handler>(Handler, () => {
			return new Handler();
		});

		serviceLocator.registerFactory<PrismaClient>(PrismaClient, () => {
			return new PrismaClient();
		});

		serviceLocator.registerFactory<ClientMessage>(ClientMessage, () => {
			return new ClientMessage();
		});

		serviceLocator.registerFactory<Password>(Password, () => {
			return new Password();
		});

		serviceLocator.registerFactory<Jwt>(Jwt, () => {
			return new Jwt();
		});

		serviceLocator.registerFactory<Token>(Token, () => {
			return new Token();
		});

		serviceLocator.registerFactory<LoadMemory>(LoadMemory, () => {
			return new LoadMemory();
		});

		serviceLocator.registerFactory<PingIncoming>(PingIncoming, () => {
			return new PingIncoming();
		});

		serviceLocator.registerFactory<AccessAccountIncoming>(
			AccessAccountIncoming,
			() => {
				return new AccessAccountIncoming();
			},
		);

		serviceLocator.registerFactory<CreateAccountIncoming>(
			CreateAccountIncoming,
			() => {
				return new CreateAccountIncoming();
			},
		);

		serviceLocator.registerFactory<CharacterListIncoming>(
			CharacterListIncoming,
			() => {
				return new CharacterListIncoming();
			},
		);

		serviceLocator.registerFactory<CreateCharacterIncoming>(
			CreateCharacterIncoming,
			() => new CreateCharacterIncoming(),
		);

		serviceLocator.registerFactory<DeleteCharacterIncoming>(
			DeleteCharacterIncoming,
			() => new DeleteCharacterIncoming(),
		);

		serviceLocator.registerFactory<SelectCharacterIncoming>(
			SelectCharacterIncoming,
			() => new SelectCharacterIncoming(),
		);

		serviceLocator.registerFactory<MoveCharacterIncoming>(
			MoveCharacterIncoming,
			() => new MoveCharacterIncoming(),
		);

		serviceLocator.registerFactory<ChatIncoming>(
			ChatIncoming,
			() => new ChatIncoming(),
		);

		serviceLocator.registerFactory<EmoteIncoming>(
			EmoteIncoming,
			() => new EmoteIncoming(),
		);
	}
}
