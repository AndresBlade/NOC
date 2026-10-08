import * as z from 'zod';

// Definición pura del schema de variables de entorno.
// Se exporta para que otros módulos (p. ej. los tests) lo reutilicen sin
// ejecutar el efecto secundario de envs.plugin.ts (envSchema.parse(process.env)).
export const envSchema = z.object({
	// PORT: z.number().int().positive(),
	PORT: z.coerce.number<string>().int().positive(),
	MAILER_EMAIL: z.email(),
	MAILER_SECRET_KEY: z.string(),
	PROD: z.coerce.boolean<string>(),
	MAILER_SERVICE: z.string(),
	MONGO_URL: z.string(),
	MONGO_DB_NAME: z.string(),
	MONGO_USER: z.string(),
	MONGO_PASS: z.string(),
})