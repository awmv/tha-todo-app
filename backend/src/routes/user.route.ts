import { Router } from "express"
import {
  createTaskHandler,
  deleteTaskHandler,
  getAllTasksHandler,
  getAllTasksIdsHandler,
  updateTaskHandler,
} from "../controller/user.controller"
import validateResource from "../middlewares/validateResourse"
import {
  createTaskInputSchema,
  deleteTaskInputSchema,
  getAllTaskIdsInputSchema,
  getAllTasksInputSchema,
  updateTaskInputSchema,
} from "../schemas/user.schema"

export const userRouter = Router()

/**
 * @openapi
 * /api/v1/user/{user_id}/tasks:
 *   get:
 *     tags:
 *       - User
 *     summary: Get all tasks for a user
 *     parameters:
 *       - name: user_id
 *         in: path
 *         description: User ID
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *           example: 33c17e0e-ec23-44d1-a19e-00f3a07e2a77
 *       - name: limit
 *         in: query
 *         description: The maximum number of tasks to return
 *         required: false
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *       - name: offset
 *         in: query
 *         description: The number of tasks to skip before starting to return items
 *         required: false
 *         schema:
 *           type: integer
 *           minimum: 0
 *           default: 0
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 tasks:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       task_id:
 *                         type: string
 *                         format: uuid
 *                         example: 33c17e0e-ec23-44d1-a19e-00f3a07e2a77
 *                       user_id:
 *                         type: string
 *                         format: uuid
 *                         example: 33c17e0e-ec23-44d1-a19e-00f3a07e2a77
 *                       description:
 *                         type: string
 *                         example: Do dishes
 *                       priority:
 *                         type: integer
 *                         example: 0
 *                       status:
 *                         type: boolean
 *                         example: false
 *                       created_at:
 *                         type: string
 *                         format: date-time
 *                         example: 2021-01-01T00:00:00.000Z
 *                       updated_at:
 *                         type: string
 *                         format: date-time
 *                         example: 2021-01-01T00:00:00.000Z
 *                       completed_at:
 *                         type: string
 *                         format: date-time
 *                         example: 2021-01-01T00:00:00.000Z
 *                 count:
 *                   type: integer
 *                   example: 20
 *                   description: The total number of tasks for the user
 *                 limit:
 *                   type: integer
 *                   example: 10
 *                   description: The maximum number of tasks returned per request
 *                 offset:
 *                   type: integer
 *                   example: 0
 *                   description: The number of tasks skipped before starting to return items
 *       400:
 *         description: Bad Request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required:
 *                 - error
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Bad Request
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required:
 *                 - error
 *               properties:
 *                 error:
 *                   type: string
 *                   example: User not found
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required:
 *                 - error
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Internal server error
 */
userRouter.get(
  "/user/:user_id/tasks",
  validateResource(getAllTasksInputSchema),
  getAllTasksHandler
)

/**
 * @openapi
 * /api/v1/user/{user_id}/task-ids:
 *   get:
 *     tags:
 *       - User
 *     summary: Get an array of all task IDs for a user
 *     parameters:
 *       - name: user_id
 *         in: path
 *         description: User ID
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *           example: 33c17e0e-ec23-44d1-a19e-00f3a07e2a77
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: string
 *                 format: uuid
 *                 example: 33c17e0e-ec23-44d1-a19e-00f3a07e2a77
 *       400:
 *         description: Bad Request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required:
 *                 - error
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Bad Request
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required:
 *                 - error
 *               properties:
 *                 error:
 *                   type: string
 *                   example: User not found
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required:
 *                 - error
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Internal Server Error
 */
userRouter.get(
  "/user/:user_id/task-ids",
  validateResource(getAllTaskIdsInputSchema),
  getAllTasksIdsHandler
)

/**
 * @openapi
 * /api/v1/user/{user_id}/task:
 *   post:
 *     tags:
 *       - User
 *     summary: Create task for a user
 *     parameters:
 *       - name: user_id
 *         in: path
 *         description: User ID
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *           example: 33c17e0e-ec23-44d1-a19e-00f3a07e2a77
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - description
 *             properties:
 *               description:
 *                 type: string
 *                 example: Do dishes
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required:
 *                 - task_id
 *                 - user_id
 *                 - description
 *                 - priority
 *                 - status
 *                 - created_at
 *               properties:
 *                 task_id:
 *                   type: string
 *                   format: uuid
 *                   example: 33c17e0e-ec23-44d1-a19e-00f3a07e2a77
 *                 user_id:
 *                   type: string
 *                   format: uuid
 *                   example: 33c17e0e-ec23-44d1-a19e-00f3a07e2a77
 *                 description:
 *                   type: string
 *                   example: Do dishes
 *                 priority:
 *                   type: integer
 *                   example: 0
 *                 status:
 *                   type: boolean
 *                   example: false
 *                 created_at:
 *                   type: string
 *                   format: date-time
 *                   example: 2021-01-01T00:00:00.000Z
 *       400:
 *         description: Bad Request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required:
 *                 - error
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Bad Request
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required:
 *                 - error
 *               properties:
 *                 error:
 *                   type: string
 *                   example: User not found
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required:
 *                 - error
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Internal server error
 */
userRouter.post(
  "/user/:user_id/task",
  validateResource(createTaskInputSchema),
  createTaskHandler
)

/**
 * @openapi
 * /api/v1/user/{user_id}/task/{task_id}:
 *   put:
 *     tags:
 *       - User
 *     summary: Update a task for a user
 *     parameters:
 *       - name: user_id
 *         in: path
 *         description: User ID
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *           example: 33c17e0e-ec23-44d1-a19e-00f3a07e2a77
 *       - name: task_id
 *         in: path
 *         description: Task ID
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *           example: 33c17e0e-ec23-44d1-a19e-00f3a07e2a77
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               description:
 *                 type: string
 *                 example: Do dishes
 *               status:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user_id:
 *                   type: string
 *                   format: uuid
 *                   example: 33c17e0e-ec23-44d1-a19e-00f3a07e2a77
 *                 task_id:
 *                   type: string
 *                   format: uuid
 *                   example: 33c17e0e-ec23-44d1-a19e-00f3a07e2a77
 *                 description:
 *                   type: string
 *                   example: Do dishes
 *                 status:
 *                   type: boolean
 *                   example: true
 *                 priority:
 *                   type: integer
 *                   example: 0
 *                 created_at:
 *                   type: string
 *                   format: date-time
 *                   example: 2021-01-01T00:00:00.000Z
 *                 updated_at:
 *                   type: string
 *                   format: date-time
 *                   example: 2021-01-01T00:00:00.000Z
 *                 completed_at:
 *                   type: string
 *                   format: date-time
 *                   example: 2021-01-01T00:00:00.000Z
 *       400:
 *         description: Bad Request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required:
 *                 - error
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Bad Request
 *       404:
 *         description: User or task not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required:
 *                 - error
 *               properties:
 *                 error:
 *                   type: string
 *                   example: User not found, Task not found
 *       422:
 *         description: Task update failed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required:
 *                 - error
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Task update failed
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required:
 *                 - error
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Internal server error
 */
userRouter.put(
  "/user/:user_id/task/:task_id",
  validateResource(updateTaskInputSchema),
  updateTaskHandler
)

/**
 * @openapi
 * /api/v1/user/{user_id}/task/{task_id}:
 *   delete:
 *     tags:
 *       - User
 *     summary: Delete a task for a user
 *     parameters:
 *       - name: user_id
 *         in: path
 *         description: User ID
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *           example: 33c17e0e-ec23-44d1-a19e-00f3a07e2a77
 *       - name: task_id
 *         in: path
 *         description: Task ID
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *           example: 33c17e0e-ec23-44d1-a19e-00f3a07e2a77
 *     requestBody:
 *       required: false
 *     responses:
 *       204:
 *         description: No content
 *       404:
 *         description: User or task not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required:
 *                 - error
 *               properties:
 *                 error:
 *                   type: string
 *                   example: User not found
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required:
 *                 - error
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Internal server error
 */
userRouter.delete(
  "/user/:user_id/task/:task_id",
  validateResource(deleteTaskInputSchema),
  deleteTaskHandler
)
