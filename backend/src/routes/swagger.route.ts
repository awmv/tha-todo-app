import config from "../config"
import swaggerJSDoc from "swagger-jsdoc"
import swaggerUi from "swagger-ui-express"
import { Request, Response, Router } from "express"

export const swaggerRouter = Router()

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Task API",
      version: "1.0.0",
    },
    servers: [
      {
        url: `http://localhost:${process.env.API_PORT}`,
        description: "Task API Server",
      },
    ],
  },
  apis: ["./src/routes/*.ts", "!./src/routes/swagger.ts"],
}

swaggerRouter.use(
  "/docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerJSDoc(options), {
    explorer: true,
    customCss: ".swagger-ui .topbar { display: none }",
    customSiteTitle: "Task API Documentation",
    swaggerUrl: "/api/v1/swagger.json",
  })
)

swaggerRouter.use("/api/v1/swagger.json", (_req: Request, res: Response) => {
  res.setHeader("Content-Type", "application/json")
  res.send(swaggerJSDoc(options))
})
