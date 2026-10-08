import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

// Carga ÚNICAMENTE .env.test en process.env antes de importar cualquier test.
// Garantiza que envs.plugin.ts (que hace schema.parse(process.env) al importarse)
// siempre lea las variables de prueba y nunca las de .env.
const envFile = fileURLToPath(new URL('../../.env.test', import.meta.url))

// Vitest/Vite escriben en process.env ANTES de los setupFiles (el proxy de
// import.meta.env p.ej. deja PROD="" y DEV="1", y añade MODE/BASE_URL), y
// process.loadEnvFile no pisa claves ya definidas. Por eso borramos primero
// cada clave del archivo para que .env.test tenga prioridad absoluta.
const content = readFileSync(envFile, 'utf8')
const keyPattern = /^\s*(?:export\s+)?([A-Za-z_][A-Za-z0-9_]*)\s*=/gm
let match: RegExpExecArray | null
while ((match = keyPattern.exec(content)) !== null) {
	const key = match[1]
	if (key !== undefined) delete process.env[key]
}

process.loadEnvFile(envFile)
