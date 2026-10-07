import { db } from './prisma/db';

import { MongoDatabase } from './data/mongo';
import { Server } from './presentation/server';
import { envs } from './config/plugins/envs.plugin';
// import { LogModel } from './data/mongo/models/log.model';

async function main() {

	await MongoDatabase.connect({
		mongoUrl: envs.MONGO_URL || '',
		dbName: envs.MONGO_DB_NAME || '',
		user: envs.MONGO_USER || '',
		pass: envs.MONGO_PASS || ''
	});

	await db.connect();

	await db.orm.public.LogModel.create({
		message: 'Test log',
		level: 'low',
		origin: 'Test',
		createdAt: Temporal.Now.instant(),
	});

	Server.start();
}

(async () => {
	main();
})();
