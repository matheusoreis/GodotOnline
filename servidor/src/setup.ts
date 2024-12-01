import { PrismaClient } from "@prisma/client";
import type { Server, ServerWebSocket } from "bun";
import { Memory } from "./core/server/memory";
import { serviceLocator } from "./core/server/service-locator";
import { SERVER_HOST, SERVER_PORT } from "./data/constants";
import { Manager } from "./net/manager";
import { Logger } from "./utils/logger";
import { LoadMemory } from "./core/server/load-memory";

export class Setup {
	constructor() {
		this.logger = serviceLocator.get<Logger>(Logger);
		this.manager = serviceLocator.get<Manager>(Manager);
		this.loadMemory = serviceLocator.get<LoadMemory>(LoadMemory);

		this.websocketHandlers = {
			open: this.websocketOpen.bind(this),
			close: this.websocketClose.bind(this),
			message: this.websocketMessage.bind(this),
		};
	}

	private readonly logger: Logger;
	private readonly manager: Manager;
	private readonly loadMemory: LoadMemory;

	private readonly websocketHandlers: {
		open: (ws: ServerWebSocket) => void;
		close: (ws: ServerWebSocket, code: number, message: string) => void;
		message: (ws: ServerWebSocket, message: Buffer) => void;
	};

	public async start(): Promise<void> {
		try {
			Bun.serve({
				hostname: SERVER_HOST,
				port: SERVER_PORT,
				fetch: this.fetchHandler,
				websocket: this.websocketHandlers,
			});

			this.logger.info("Servidor iniciado com sucesso!");
			this.logger.info(`Servidor escutando em: ${SERVER_PORT}`);

			this.logger.info("Iniciando a memória do servidor...");

			this.logger.info("Carregando os mundos...");
			await this.loadMemory.loadWorlds();

			this.logger.info("Aguardando por novas conexões...");
		} catch (error) {
			this.logger.error(`Falha ao iniciar o servidor, erro: ${error}`);
		}
	}

	private async fetchHandler(req: Request, server: Server): Promise<Response> {
		if (req.headers.get("upgrade")?.toLowerCase() === "websocket") {
			const success: boolean = server.upgrade(req);

			if (!success) {
				return new Response("Falha na atualização para WebSocket", {
					status: 400,
				});
			}
		}

		return new Response("O acesso HTTP não é permitido", { status: 403 });
	}

	private websocketOpen(ws: ServerWebSocket): void {
		this.logger.info(`Nova conexão: ${ws.remoteAddress}`);
		this.manager.websocketOpen(ws);
	}

	private websocketClose(ws: ServerWebSocket): void {
		this.logger.info(`Conexão fechada: ${ws.remoteAddress}`);
		this.manager.websocketClose(ws);
	}

	private websocketMessage(ws: ServerWebSocket, message: Buffer): void {
		if (!(message instanceof Buffer)) {
			this.logger.error("Mensagem inválida recebida: não é um Buffer.");

			return;
		}

		const uint8Message = new Uint8Array(message);
		this.manager.websocketMessage(ws, uint8Message);
	}
}
