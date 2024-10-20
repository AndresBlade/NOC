import { Server } from './presentation/server';
import 'dotenv/config';

function main() {
	Server.start();
}

(async () => {
	main();
})();
