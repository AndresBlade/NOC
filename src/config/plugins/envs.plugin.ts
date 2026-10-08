import { envSchema } from './envs.schema'

export { envSchema }

export const envs = envSchema.parse(process.env);