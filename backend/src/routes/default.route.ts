import { Request, Response, Router } from "express"

export const defaultRouter = Router()

/**
 * @openapi
 * /api/v1/healthcheck:
 *   get:
 *     tags:
 *       - Default
 *     description: Check the health of the service
 *     responses:
 *       200:
 *         description: The service is healthy and running
 */
defaultRouter.get("/healthcheck", (_req: Request, res: Response) => {
  res.status(200).json({ message: "OK" })
})
