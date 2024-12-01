import { AlertCore } from "../core/game/alert/alert.core";
import type { Player } from "../core/game/player/player";
import { Jwt } from "../core/server/jwt";
import { serviceLocator } from "../core/server/service-locator";

export class Token {
	constructor() {
		this.jwt = serviceLocator.get<Jwt>(Jwt);
	}

	private readonly jwt: Jwt;

	public verify(player: Player, token: string): boolean {
		if (!this.jwt.verifyToken(token)) {
			new AlertCore(
				player,
				"O token de conexão com o servidor não está válido!",
			).send();

			return false;
		}

		return true;
	}
}
