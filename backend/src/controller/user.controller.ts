import { Request, Response } from "express"
import {
  createTaskRequest,
  deleteTaskRequest,
  updateTaskRequest,
} from "../schemas/user.schema"
import * as db from "../db/user.db"

export const createTaskHandler = async (req: Request, res: Response) => {
  try {
    const taskRow = await db.createTask({
      description: req.body.description,
      user_id: req.params.user_id,
    } as createTaskRequest)
    if (taskRow !== null) return res.status(201).json(taskRow)
  } catch (error: unknown) {
    if (error instanceof Error && error.message === "User does not exist") {
      return res.status(404).json({ error: "User not found" })
    }
    res.status(500).json({ error: "Internal Server Error" })
  }
}

export const getAllTasksHandler = async (req: Request, res: Response) => {
  try {
    const { limit, offset } = req.query as {
      limit?: string
      offset?: string
    }

    const tasks = await db.getAllTasks({
      user_id: req.params.user_id,
      limit: limit !== undefined ? Number(limit) : 10,
      offset: offset !== undefined ? Number(offset) : 0,
    })

    return res
      .set(
        "Cache-Control",
        "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0"
      )
      .status(200)
      .json(tasks)
  } catch (error: unknown) {
    if (error instanceof Error && error.message === "User not found")
      return res.status(404).json({ error: "User not found" })

    res.status(500).json({ error: "Internal Server Error" })
  }
}

export const getAllTasksIdsHandler = async (req: Request, res: Response) => {
  try {
    const tasks = await db.getAllTaskIds(req.params.user_id)
    return res.status(200).json({ task_ids: tasks })
  } catch (error: unknown) {
    if (error instanceof Error && error.message === "User not found") {
      return res.status(404).json({ error: "User not found" })
    }

    res.status(500).json({ error: "Internal Server Error" })
  }
}

export const updateTaskHandler = async (req: Request, res: Response) => {
  try {
    const requestPayload = {
      user_id: req.params.user_id,
      task_id: req.params.task_id,
      description: req.body.description,
      status: req.body.status,
    } as updateTaskRequest
    const taskRow = await db.updateTask(requestPayload)
    if (taskRow !== null) return res.status(200).json(taskRow)
  } catch (error: unknown) {
    if (error instanceof Error && error.message === "User not found")
      return res.status(404).json({ error: "User not found" })

    if (error instanceof Error && error.message === "Task not found")
      return res.status(404).json({ error: "Task not found" })

    if (error instanceof Error && error.message === "Task update failed")
      return res.status(422).json({ error: "Task update failed" })

    res.status(500).json({ message: "Internal Server Error" })
  }
}

export const deleteTaskHandler = async (req: Request, res: Response) => {
  try {
    await db.deleteTask({
      user_id: req.params.user_id,
      task_id: req.params.task_id,
    } as deleteTaskRequest)
    return res.sendStatus(204)
  } catch (error: unknown) {
    if (error instanceof Error) {
      if (error.message === "User not found") {
        return res.status(404).json({ error: "User not found" })
      }
      if (error.message === "Task not found") {
        return res.status(404).json({ error: "Task not found" })
      }
    }
    res.status(500).json({ error: "Internal Server Error" })
  }
}
