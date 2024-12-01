import { MAX_CHARACTERS, MAX_PLAYERS, MAX_WORLDS } from "../../data/constants";
import type { Character } from "../game/character/character";
import type { Player } from "../game/player/player";
import type { WorldCore } from "../game/world/world.core";
import { Slots } from "./slots";

export class Memory {
	public players: Slots<Player> = new Slots<Player>(MAX_PLAYERS);
	public worlds: Slots<WorldCore> = new Slots<WorldCore>(MAX_WORLDS);
	public characters: Slots<Character> = new Slots<Character>(MAX_CHARACTERS);
}
