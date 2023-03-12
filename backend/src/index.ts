// import "./utils/loadEnvVars"
// import "./utils/validateEnvVars"
import * as log from "./utils/logger"
import config from "./config"
import cors from "cors"
import express from "express"
import morgan from "morgan"
import { defaultRouter } from "./routes/default.route"
import { errorMiddleware, notFoundMiddleware } from "./middlewares"
import { userRouter } from "./routes/user.route"
import { swaggerRouter } from "./routes/swagger.route"

const server = express()
const baseApiRouter = express.Router()
const { API_PORT, API_VERSION } = config

server
  .use(cors())
  .use(morgan("combined"))
  .use(express.json())
  .use(swaggerRouter)
  .use(`/api/${API_VERSION}`, baseApiRouter)
  .use(notFoundMiddleware)
  .use(errorMiddleware)
  .listen(API_PORT, "0.0.0.0", () =>
    log.info(log.Labels.SERVER_STARTUP, `Server listening on port ${API_PORT}`)
  )

baseApiRouter.use(defaultRouter).use(userRouter)

export default server
