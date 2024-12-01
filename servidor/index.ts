import { Dependency } from "./src/core/dependency";
import { serviceLocator } from "./src/core/server/service-locator";
import { Setup } from "./src/setup";

async function main() {
	const dependency: Dependency = new Dependency();
	dependency.setup();

	const setup: Setup = serviceLocator.get<Setup>(Setup);
	await setup.start();
}

main();
