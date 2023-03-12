import { getConnectionPool } from "../utils/db.utill"
import * as log from "../utils/logger"
import {
  createTaskRequest,
  createTaskResponse,
  deleteTaskRequest,
  getAllTasksResponse,
  updateTaskRequest,
  updateTaskResponse,
} from "../schemas/user.schema"
import { OkPacket, RowDataPacket } from "mysql2/promise"

export const createTask = async (task: createTaskRequest) => {
  const pool = await getConnectionPool()
  const connection = await pool.getConnection()
  try {
    const [userRows] = await connection.execute(
      `SELECT user_id FROM users WHERE user_id = ?`,
      [task.user_id]
    )

    if ((userRows as RowDataPacket[]).length === 0) {
      throw new Error("User does not exist")
    }

    const [rows] = await connection.execute(
      "INSERT INTO tasks (user_id, description) VALUES (?, ?) RETURNING task_id, user_id, description, priority, status, created_at",
      [task.user_id, task.description]
    )

    if (Array.isArray(rows) && rows.length > 0) {
      const taskRow = rows[0] as createTaskResponse
      return {
        task_id: taskRow.task_id,
        user_id: taskRow.user_id,
        description: taskRow.description,
        priority: taskRow.priority,
        status: Boolean(taskRow.status),
        created_at: new Date(taskRow.created_at),
      }
    }
    throw new Error("Task creation failed")
  } catch (error) {
    log.error(log.Labels.DB_OPERATIONS, error, log.Level.ERROR)
    throw error
  } finally {
    connection.release()
  }
}

export const deleteTask = async (task: deleteTaskRequest) => {
  const pool = await getConnectionPool()
  const connection = await pool.getConnection()

  try {
    const [userRows] = await connection.execute(
      "SELECT user_id FROM users WHERE user_id = ?",
      [task.user_id]
    )

    if ((userRows as RowDataPacket[]).length === 0) {
      throw new Error("User not found")
    }

    const [taskRows] = await connection.execute(
      "SELECT task_id FROM tasks WHERE user_id = ? AND task_id = ?",
      [task.user_id, task.task_id]
    )

    if ((taskRows as RowDataPacket[]).length === 0) {
      throw new Error("Task not found")
    }

    const [result] = await connection.execute(
      "DELETE FROM tasks WHERE task_id = ?",
      [task.task_id]
    )

    if ((result as OkPacket).affectedRows > 0) {
      return
    }

    throw new Error("Task deletion failed")
  } catch (error) {
    log.error(log.Labels.DB_OPERATIONS, error, log.Level.ERROR)
    throw error
  } finally {
    connection.release()
  }
}

export const updateTask = async (
  task: updateTaskRequest
): Promise<updateTaskResponse | null> => {
  const pool = await getConnectionPool()
  const connection = await pool.getConnection()

  try {
    const [userRows] = await connection.execute(
      "SELECT user_id FROM users WHERE user_id = ?",
      [task.user_id]
    )

    if ((userRows as RowDataPacket[]).length === 0) {
      throw new Error("User not found")
    }

    const [taskRows] = await connection.execute(
      "SELECT task_id FROM tasks WHERE user_id = ? AND task_id = ?",
      [task.user_id, task.task_id]
    )

    if ((taskRows as RowDataPacket[]).length === 0) {
      throw new Error("Task not found")
    }

    const [taskStatus] = await connection.execute(
      "SELECT status FROM tasks WHERE user_id = ? AND task_id = ?",
      [task.user_id, task.task_id]
    )

    if ((taskStatus as RowDataPacket[]).length === 0) {
      throw new Error("Internal server error")
    }

    const currentStatus = Boolean((taskStatus as RowDataPacket[])[0].status)

    const [result] = await connection.execute(
      `UPDATE tasks SET description = ?, status = ?, updated_at = UTC_TIMESTAMP(), completed_at = ${
        currentStatus === false && task.status === true
          ? "UTC_TIMESTAMP()"
          : "null"
      } WHERE task_id = ? AND user_id = ?`,
      [
        task.description ?? (taskRows as RowDataPacket[])[0].description,
        task.status ?? currentStatus,
        task.task_id,
        task.user_id,
      ]
    )

    if ((result as OkPacket).affectedRows > 0) {
      const [updatedTaskRow] = await connection.execute(
        "SELECT task_id, user_id, description, priority, status, created_at, updated_at, completed_at FROM tasks WHERE task_id = ? AND user_id = ?",
        [task.task_id, task.user_id]
      )

      const responseTimestamp = (updatedTaskRow as RowDataPacket[])[0]
        .updated_at
      const updatedTask = {
        //@ts-ignore
        ...updatedTaskRow[0],
        updated_at: responseTimestamp,
      } as updateTaskResponse
      return updatedTask
    }

    throw new Error("Task update failed")
  } catch (error) {
    log.error(log.Labels.DB_OPERATIONS, error, log.Level.ERROR)
    throw error
  } finally {
    connection.release()
  }
}

export const getAllTasks = async (requestPayload: {
  user_id: string
  limit: number
  offset: number
}): Promise<getAllTasksResponse> => {
  const { user_id, limit, offset } = requestPayload

  const pool = await getConnectionPool()
  const connection = await pool.getConnection()

  try {
    const [userRows] = await connection.execute(
      "SELECT user_id FROM users WHERE user_id = ?",
      [user_id]
    )

    if ((userRows as RowDataPacket[]).length === 0) {
      throw new Error("User not found")
    }

    const [countRows] = await connection.execute(
      "SELECT COUNT(*) as count FROM tasks WHERE user_id = ?",
      [user_id]
    )

    const count = (countRows as RowDataPacket[])[0].count

    const [taskRows] = await connection.execute(
      "SELECT task_id, user_id, description, priority, status, created_at, updated_at, completed_at FROM tasks WHERE user_id = ? LIMIT ? OFFSET ?",
      [user_id, limit, offset]
    )

    const tasks = (taskRows as RowDataPacket[]).map(
      (taskRow: RowDataPacket) => {
        return {
          task_id: taskRow.task_id,
          user_id: taskRow.user_id,
          description: taskRow.description,
          priority: taskRow.priority,
          status: Boolean(taskRow.status),
          created_at: taskRow.created_at,
          updated_at: taskRow.updated_at,
          completed_at: taskRow.completed_at,
        }
      }
    )

    return {
      tasks,
      count,
      limit,
      offset,
    }
  } catch (error) {
    log.error(log.Labels.DB_OPERATIONS, error, log.Level.ERROR)
    throw error
  } finally {
    connection.release()
  }
}

export const getAllTaskIds = async (user_id: string): Promise<string[]> => {
  const pool = await getConnectionPool()
  const connection = await pool.getConnection()

  try {
    const [userRows] = await connection.execute(
      "SELECT user_id FROM users WHERE user_id = ?",
      [user_id]
    )

    if ((userRows as RowDataPacket[]).length === 0) {
      throw new Error("User not found")
    }

    const [taskRows] = await connection.execute(
      "SELECT task_id FROM tasks WHERE user_id = ?",
      [user_id]
    )

    return (taskRows as RowDataPacket[]).map((row) => row.task_id)
  } catch (error) {
    log.error(log.Labels.DB_OPERATIONS, error, log.Level.ERROR)
    throw error
  } finally {
    connection.release()
  }
}
