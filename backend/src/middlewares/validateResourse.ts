import { Request, Response, NextFunction } from "express"
import { AnyZodObject, ZodError, ZodOptional } from "zod"
import config from "../config"

const validateResource =
  (schema: AnyZodObject | ZodOptional<AnyZodObject>) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { params, body } = req
      const payload = { ...params, ...body }
      await schema.parseAsync(payload)
      next()
    } catch (error) {
      if (error instanceof ZodError && config.SHOW_ZOD_ERRORS)
        return res
          .status(400)
          .json(
            error.issues.map((e) => ({ path: e.path[0], message: e.message }))
          )
      if (error instanceof ZodError && !config.SHOW_ZOD_ERRORS)
        return res.status(400).json({ error: "Bad Request" })
      res.status(500).json({ error: "Internal Server Error" })
    }
  }

export default validateResource
