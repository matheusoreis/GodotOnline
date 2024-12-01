import { PrismaClient } from "@prisma/client";
import { Logger } from "../../../utils/logger";
import { Password } from "../../server/password";
import { serviceLocator } from "../../server/service-locator";
import { AlertCore } from "../alert/alert.core";
import type { Player } from "../player/player";
import { VersionCore } from "../version/version.core";
import { CreateAccountOutgoing } from "./create-account.outgoing";

export type CreateAccountParams = {
	email: string;
	password: string;
	rePassword: string;
	major: number;
	minor: number;
	revision: number;
};

export class CreateAccountCore {
	constructor(player: Player, params: CreateAccountParams) {
		this.player = player;
		this.email = params.email;
		this.password = params.password;
		this.rePassword = params.rePassword;
		this.major = params.major;
		this.minor = params.minor;
		this.revision = params.revision;

		this.prisma = serviceLocator.get<PrismaClient>(PrismaClient);
		this.hash = serviceLocator.get<Password>(Password);
		this.logger = serviceLocator.get<Logger>(Logger);
	}

	public readonly player: Player;
	public readonly email: string;
	public readonly password: string;
	public readonly rePassword: string;
	public readonly major: number;
	public readonly minor: number;
	public readonly revision: number;

	private readonly prisma: PrismaClient;
	private readonly hash: Password;
	private readonly logger: Logger;

	public async create(): Promise<void> {
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
			const account = await this.prisma.accounts.findUnique({
				where: { email: this.email },
			});

			if (account) {
				new AlertCore(
					this.player,
					"Já existe uma conta com este e-mail.",
				).send();

				return;
			}

			const hashedPassword: string = await this.hash.hash(this.password);

			await this.prisma.accounts.create({
				data: {
					email: this.email,
					password: hashedPassword,
				},
			});

			new AlertCore(
				this.player,
				"Sua conta foi criada com sucesso!",
				false,
			).send();

			new CreateAccountOutgoing().sendTo(this.player);
		} catch (error) {
			new AlertCore(this.player, `Error: ${error}`, true).send();

			this.logger.error(`${error}`);
		}
	}
}
