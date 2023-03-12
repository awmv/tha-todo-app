export enum Labels {
  MIDDLEWARE_FALLBACK = "MIDDLEWARE_FALLBACK",
  SERVICE_FALLBACK = "SERVICE_FALLBACK",
  UTILITY_LOAD_ENV_VARS = "UTILITY_LOAD_ENV_VARS",
  UTILITY_VALIDATE_ENV_VARS = "UTILITY_VALIDATE_ENV_VARS",
  UTILITY_DB_CONNECTION = "UTILITY_DB_CONNECTION",
  DB_OPERATIONS = "DB_OPERATIONS",
  SERVER_STARTUP = "SERVER_STARTUP",
}

export enum Level {
  CRITICAL = 1,
  ERROR,
  WARN,
  INFO,
}

const logMessage =
  (logFn: (msg: string) => void, defaultLevel: Level) =>
  (label: Labels, details: unknown, level: Level = defaultLevel) => {
    logFn(JSON.stringify({ level, label, details: String(details) }))
  }

const error = logMessage(console.error, Level.ERROR)
const warn = logMessage(console.warn, Level.WARN)
const info = logMessage(console.info, Level.INFO)

export { error, warn, info }
