const config: {
  [key: string]: any
} = {
  API_PORT: process.env.API_PORT || "",
  API_VERSION: process.env.API_VERSION || "",
  DB_CREDENTIALS: {
    host: process.env.DB_HOST || "",
    port: process.env.DB_PORT || "",
    user: process.env.DB_USER || "",
    password: process.env.DB_PASSWORD || "",
    database: process.env.MYSQL_DATABASE || "",
  },
  SHOW_ZOD_ERRORS: process.env.SHOW_ZOD_ERRORS || true,
}
export default config
