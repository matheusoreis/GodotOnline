import jwt from "jsonwebtoken";
import { Logger } from "../../utils/logger";
import { serviceLocator } from "./service-locator";

export class Jwt {
	constructor() {
		this.secret = process.env.JWT_SECRET ?? "";

		this.logger = serviceLocator.get<Logger>(Logger);
	}

	private readonly secret: string;
	private readonly logger: Logger;

	public generateToken(payload: object): string {
		return jwt.sign(payload, this.secret, { expiresIn: "12h" });
	}

	public verifyToken(token: string): boolean {
		try {
			jwt.verify(token, this.secret);
			return true;
		} catch (error) {
			this.logger.error(`Token verification failed: ${error}`);
			return false;
		}
	}
}
