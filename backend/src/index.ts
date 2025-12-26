import { env } from "@/common/utils/envConfig";
import { app, logger } from "@/server";

// Initialize connections before starting the server
const initializeApp = async () => {
	try {

		// Start HTTP server
		const server = app.listen(env.PORT, () => {
			const { NODE_ENV, HOST, PORT } = env;
			logger.info(`🚀 Server (${NODE_ENV}) running on http://${HOST}:${PORT}`);
		});

		const onCloseSignal = async () => {
			logger.info("SIGINT/SIGTERM received, shutting down gracefully");

			server.close(() => {
				logger.info("HTTP server closed");
				process.exit(0);
			});
			setTimeout(() => {
				logger.error("Forced shutdown after timeout");
				process.exit(1);
			}, 10000).unref();
		};

		process.on("SIGINT", onCloseSignal);
		process.on("SIGTERM", onCloseSignal);
	} catch (error) {
		logger.error({ err: error }, "Failed to initialize application");
		process.exit(1);
	}
};

initializeApp();
