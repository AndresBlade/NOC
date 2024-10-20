// import { Server } from './presentation/server';
import 'dotenv/config';
import { envs } from './config/plugins/envs.plugin';

function main() {
	// Server.start();
	console.log(envs);
}

(async () => {
	main();
})();
