import { Memory } from "../../server/memory";
import { serviceLocator } from "../../server/service-locator";
import { AlertCore } from "../alert/alert.core";
import { CharacterDisconnectedCore } from "../character-disconnected/character-disconnected.core";
import type { Character } from "../character/character";
import { NewCharacterToCore } from "../new-character-to/new-character-to.core";
import type { Player } from "../player/player";
import { SelectCharacterCore } from "../select-character/select-character.core";
import { WorldCharactersToCore } from "../world-characters-to/world-characters-to.core";

export class WorldOutgoing {
	constructor() {
		this.memory = serviceLocator.get<Memory>(Memory);
	}

	private memory: Memory;

	public sendCharacterSelected(player: Player, character: Character) {
		new SelectCharacterCore(player, character).send();
	}

	public sendOthersOfNewCharacter(
		player: Player,
		character: Character,
		world: number,
	) {
		new NewCharacterToCore(player, character, world).send();
	}

	public sendExistingCharacters(player: Player) {
		const characterInUse = player.getCharacterInUse();
		if (!characterInUse) {
			new AlertCore(
				player,
				"Personagem não encontrado ou não pôde ser definido como ativo!",
			).send();

			return;
		}

		// Filtrar os personagens da memória que estão no mesmo mundo do personagem em uso
		const characters = this.memory.characters.filter((character) => {
			// Verificar se o personagem pertence ao mesmo mundo do personagem em uso
			return character?.world === characterInUse.world;
		}) as Character[];

		new WorldCharactersToCore(player, characters).send();
	}

	public sendDisconnectCharacter(player: Player, character: Character) {
		new CharacterDisconnectedCore(player.id, character.world).send();
	}
}
