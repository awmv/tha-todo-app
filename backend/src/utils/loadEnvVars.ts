import dotenv from "dotenv"
import * as log from "../utils/logger"

const loadEnvVars = () => {
  const result = dotenv.config({ path: "../.env" })

  if (result.error)
    log.error(
      log.Labels.UTILITY_LOAD_ENV_VARS,
      result.error,
      log.Level.CRITICAL
    )

  return process.env
}

loadEnvVars()
