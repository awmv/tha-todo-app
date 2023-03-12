import * as mysql from "mysql2/promise"
import config from "../config"
import * as log from "./logger"

let pool: mysql.Pool | null = null

export const getConnectionPool = async (
  poolOptions: mysql.PoolOptions = config.DB_CREDENTIALS
): Promise<mysql.Pool> => {
  if (!pool) {
    try {
      pool = mysql.createPool(poolOptions)
    } catch (error) {
      log.error(
        log.Labels.UTILITY_DB_CONNECTION,
        "Error connecting to the database",
        log.Level.CRITICAL
      )
      throw error
    }
  }

  return pool
}
