import type { ServerWebSocket } from "bun";
import { Handler } from "../../../net/handler";
import { ClientMessage } from "../../../net/protocol/client/client-message";
import { Memory } from "../../server/memory";
import { serviceLocator } from "../../server/service-locator";
import type { Character } from "../character/character";

export class Player {
	constructor(ws: ServerWebSocket, id: number) {
		this.ws = ws;
		this.id = id;

		this.handler = serviceLocator.get<Handler>(Handler);
		this.memory = serviceLocator.get<Memory>(Memory);
		this.clientMessage = serviceLocator.get<ClientMessage>(ClientMessage);
	}

	public readonly ws: ServerWebSocket;
	public readonly id: number;
	private databaseId?: number;
	private characters?: Character[];
	private characterInUse?: Character;

	private handler: Handler;
	private memory: Memory;
	private clientMessage: ClientMessage;

	// Verifica se a connection está conectada.
	public isConnected(): boolean {
		return this.ws.readyState === 1;
	}

	// Desconecta a connection do servidor.
	public disconnect(): void {
		if (!this.isConnected()) {
			return;
		}

		this.memory.players.remove(this.id);

		// remover o jogador do mapa para todos
		this.ws.close();
	}

	public handleMessage(message: Uint8Array): void {
		this.clientMessage.setBuffer(message);
		this.handler.handleMessage(this, this.clientMessage);
	}

	public addToMemory(): void {
		this.memory.players.add(this);
	}

	public addCharacters(chars: Character[]): void {
		this.characters = chars;
	}

	public addCharacter(character: Character): void {
		if (!this.characters) {
			this.characters = [];
		}

		if (!this.characters.find((c) => c.id === character.id)) {
			this.characters.push(character);
		}
	}

	public setCharacterInUseById(charId: number): void {
		if (this.characters) {
			const character = this.characters.find((c) => c.id === charId);

			if (character) {
				this.characterInUse = character;
			} else {
				throw new Error(`Character with ID ${charId} not found.`);
			}
		} else {
			throw new Error("Character list is not initialized.");
		}
	}

	public addDatabaseId(databaseId: number): void {
		this.databaseId = databaseId;
	}

	public getDatabaseId(): number | undefined {
		return this.databaseId;
	}

	public removeCharacter(characterId: number): void {
		this.characters = this.characters?.filter((c) => c.id !== characterId);

		if (this.characterInUse && this.characterInUse.id === characterId) {
			this.characterInUse = undefined;
		}
	}

	public getCharacterInUse(): Character | undefined {
		return this.characterInUse;
	}
}
