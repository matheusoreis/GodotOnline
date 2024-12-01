import {
	MAJOR_VERSION,
	MINOR_VERSION,
	REVISION_VERSION,
} from "../../../data/constants";
import { Logger } from "../../../utils/logger";
import { serviceLocator } from "../../server/service-locator";
import type { Player } from "../player/player";

export class VersionCore {
	constructor(player: Player, major: number, minor: number, revision: number) {
		this.player = player;
		this.major = major;
		this.minor = minor;
		this.revision = revision;

		this.logger = serviceLocator.get<Logger>(Logger);
	}

	public readonly player: Player;
	public readonly major: number;
	public readonly minor: number;
	public readonly revision: number;

	private readonly logger: Logger;

	public check(): boolean {
		if (
			this.major !== MAJOR_VERSION ||
			this.minor !== MINOR_VERSION ||
			this.revision !== REVISION_VERSION
		) {
			this.logger.player(
				"A versão do cliente está desatualizada, atualize para continuar jogando.",
			);

			return false;
		}

		return true;
	}
}
