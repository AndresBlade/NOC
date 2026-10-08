# AGENTS.md

Proyecto **05-noc**: CLI/servicio Node que cada 5 s comprueba URLs y guarda logs en filesystem, MongoDB y PostgreSQL. TypeScript ESM (`"type": "module"`), sin framework web (no hay HTTP server real; `Server.start()` solo lanza un cron).

## Comandos

- `npm run dev` — arranque en watch con `tsx watch --env-file=.env src/app.ts`. Las variables de entorno las carga **tsx** vía `--env-file`, no dotenv: cualquier script nuevo que no pase por tsx debe cargar `.env` por su cuenta.
- `npx tsc --noEmit` — verificación de tipos. **No hay lint ni formatter** en el repo ni en CI (no existe `.github/`).
- Tests con **Vitest**: `npm run test:unit` (`vitest run`) corre los tests sin Docker; `npm test` levanta primero Docker (`docker compose -f compose.test.yaml --env-file .env.test up -d`) y deja vitest en watch; `npm run coverage`.
- Entorno de pruebas: `vitest.config.ts` registra `src/tests/setup-env.ts` como `setupFiles`, que ejecuta `process.loadEnvFile('.env.test')` **antes** de importar cualquier test. En tests se usa **únicamente `.env.test`, nunca `.env`** (Vitest no carga ningún `.env` por sí mismo). El orden importa: `envs.plugin.ts` hace `schema.parse(process.env)` al importarse.
- `npm run build` — `rimraf dist && tsc`. ⚠️ `npm start` está roto: `tsconfig` tiene `rootDir: "."`, así que el build emite `dist/src/app.js`, pero el script ejecuta `node dist/app.js`. Usar `npm run dev` o corregir el path.
- Prisma 8: tras editar `src/prisma/contract.prisma` ejecutar `npx prisma contract emit` para regenerar `src/prisma/contract.json` y `contract.d.ts`. **Están commiteados: commitearlos siempre, nunca editarlos a mano.** Ver `prisma-8.md` (docs generados de Prisma 8) para el resto del workflow.

Orden habitual de verificación: `npx tsc --noEmit` (compila todo el `src` + `prisma.config.ts`).

## Infraestructura

- `docker compose up -d` levanta `mongo-db` (27017) y `postgres-db` (5432); las credenciales salen de `.env`.
- `.env` es obligatorio para cualquier cosa (dev, build de Prisma, compose).
- ⚠️ `.env.template` está **incompleto**: le faltan `POSTGRES_URL` (la exigen `prisma.config.ts` y `src/prisma/db.ts`) y las variables de compose `POSTGRES_USER/PASSWORD/DB`. `.env.example` solo documenta `DATABASE_URL`, que **no es la variable que usa el código** (el código usa `POSTGRES_URL`). Copiar de un `.env` funcionando, no de los templates.
- `prisma.config.ts` hace `console.log(process.env['POSTGRES_URL'])` en cada arranque del CLI de Prisma: ruido esperado, y expone la URL de conexión en logs.

## Arquitectura

Clean Architecture en capas dentro de `src/` — la dependencia apunta hacia dentro (`domain` no importa de nadie):

- `domain/` — entidades (`LogEntity`), casos de uso (`check-service*`, `send-email-logs`) y abstracciones (`LogDatasource`, `LogRepository`).
- `infrastructure/` — adaptadores concretos: `file-system`, `mongo` (Mongoose), `postgres` (Prisma) + `LogRepositoryImplementation`.
- `presentation/` — **composition root**: `server.ts` es donde se ensamblan repositorios, servicios y el cron. Toda inyección de dependencias nueva va ahí.
- `config/plugins/envs.schema.ts` — definición del schema de variables de entorno (`envSchema`, exportado para reutilizar sin efecto secundario).
- `config/plugins/envs.plugin.ts` — acceso a variables de entorno: aplica `envSchema` a `process.env` (`envs`), re-exporta `envSchema`.
- `data/mongo/` — **legado**: conexión/modelos Mongoose antiguos que conviven con `infrastructure/datasources/mongo-log.datasource.ts`. No usar como referencia de patrón; lo nuevo va en `infrastructure/`.

Convenciones:

- Los casos de uso son clases con interfaz `...UseCase { execute(...) }` e inyectan `LogRepository` por constructor; no importan datasources directamente.
- Un mismo log se persiste en los 3 repositorios (`CheckServiceMultiple` recibe un array) — al añadir un storage nuevo, conectarlo ahí.
- `tsconfig` es estricto y con flags que suelen romper código generado a la ligera: `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`, `noImplicitOverride` (los métodos sobreescritos **deben** llevar `override`), `noPropertyAccessFromIndexSignature` (usa `env['VAR']`, no `env.VAR`).
- `module: preserve` + `moduleResolution: bundler`: las importaciones no llevan extensión `.js`. Los JSON se importan con atributo de import (`with { type: 'json' }`).
- Imports de Prisma 8 son `@prisma/orm-postgres/...` (ORM 8, no `@prisma/client`); no existe `schema.prisma`.

## Estado conocido

- El cron (`*/5 * * * * *` en `presentation/server.ts`) hace `fetch` real a URLs de prueba y escribe en las 3 bases de datos en cada tick: `npm run dev` genera tráfico de red y logs constantes.
- `src/app.ts` crea un registro de prueba en Postgres al arrancar y usa `Temporal.Now.instant()` sin importar `Temporal` (depende del global de `lib: ["esnext.temporal"]`). Verificar runtime si se toca ese arranque.
