import { PrismaClient, type Accounts } from "@prisma/client";
import { Logger } from "../../../utils/logger";
import { Password } from "../../server/password";
import { serviceLocator } from "../../server/service-locator";
import { AlertCore } from "../alert/alert.core";
import type { Player } from "../player/player";
import { VersionCore } from "../version/version.core";
import { AccessAccountOutgoing } from "./access-account.outgoing";
import { Jwt } from "../../server/jwt";

export type AccessAccountParams = {
	email: string;
	password: string;
	major: number;
	minor: number;
	revision: number;
};

export class AccessAccountCore {
	constructor(player: Player, params: AccessAccountParams) {
		this.player = player;
		this.email = params.email;
		this.password = params.password;
		this.major = params.major;
		this.minor = params.minor;
		this.revision = params.revision;

		this.prisma = serviceLocator.get<PrismaClient>(PrismaClient);
		this.hash = serviceLocator.get<Password>(Password);
		this.logger = serviceLocator.get<Logger>(Logger);
		this.jwt = serviceLocator.get<Jwt>(Jwt);
	}

	public readonly player: Player;
	public readonly email: string;
	public readonly password: string;
	public readonly major: number;
	public readonly minor: number;
	public readonly revision: number;

	private readonly prisma: PrismaClient;
	private readonly hash: Password;
	private readonly logger: Logger;
	private readonly jwt: Jwt;

	public async access(): Promise<void> {
		const version: boolean = new VersionCore(
			this.player,
			this.major,
			this.minor,
			this.revision,
		).check();

		if (!version) {
			new AlertCore(
				this.player,
				"O seu cliente está desatualizado, desconectando...!",
				true,
			).send();

			return;
		}

		if (!this.email) {
			new AlertCore(this.player, "O email é obrigatório!").send();
		}

		if (!this.password) {
			new AlertCore(this.player, "A senha é obrigatória!").send();
		}

		try {
			const account: Accounts | null = await this.prisma.accounts.findUnique({
				where: { email: this.email },
			});

			if (!account) {
				new AlertCore(
					this.player,
					"A conta informada não foi encontrada!",
				).send();

				return;
			}

			const hashedPassword = await this.hash.verify(
				this.password,
				account.password,
			);

			if (!hashedPassword) {
				new AlertCore(this.player, "A senha informada está inválida!").send();

				return;
			}

			const payload = {
				id: account.id,
				email: account.email,
				createdAt: account.createdAt,
				updatedAt: account.updatedAt,
			};

			const token: string = this.jwt.generateToken(payload);

			this.player.addDatabaseId(account.id);
			new AccessAccountOutgoing(token).sendTo(this.player);
		} catch (error) {
			new AlertCore(this.player, `Error: ${error}`, true).send();

			this.logger.error(`${error}`);
		}
	}
}
