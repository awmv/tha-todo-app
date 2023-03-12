import * as z from "zod"

const getUserTasksInputSchema = z.object({
  user_id: z.string().uuid(),
})

export type getUserTasksRequest = z.infer<typeof getUserTasksInputSchema>

export const createTaskInputSchema = z.object({
  user_id: z
    .string({
      required_error: "User ID is required",
    })
    .uuid()
    .nonempty(),
  description: z
    .string({
      required_error: "Description is required",
    })
    .nonempty(),
})

export type createTaskRequest = z.infer<typeof createTaskInputSchema>

export const createTaskOutputSchema = z.object({
  task_id: z
    .string({
      required_error: "Task ID is required",
    })
    .uuid(),
  user_id: z
    .string({
      required_error: "User ID is required",
    })
    .uuid(),
  description: z.string({
    required_error: "Description is required",
  }),
  priority: z
    .number({
      required_error: "Priority is required",
    })
    .int()
    .min(0)
    .max(2),
  status: z.boolean({
    required_error: "Status is required",
  }),
  created_at: z.date({
    required_error: "Created at is required",
  }),
})

export type createTaskResponse = z.infer<typeof createTaskOutputSchema>

export const updateTaskInputSchema = z.object({
  user_id: z
    .string({
      required_error: "User ID is required",
    })
    .uuid()
    .nonempty(),
  task_id: z
    .string({
      required_error: "Task ID is required",
    })
    .uuid()
    .nonempty(),
  description: z
    .string({
      required_error: "Description is required",
    })
    .nonempty(),
  status: z.boolean({
    required_error: "Status is required",
  }),
})

export type updateTaskRequest = z.infer<typeof updateTaskInputSchema>

export const deleteTaskInputSchema = z.object({
  user_id: z.string().uuid().nonempty(),
  task_id: z.string().uuid().nonempty(),
})
export type deleteTaskRequest = z.infer<typeof deleteTaskInputSchema>

const getTaskOutputSchema = z.object({
  task_id: z.string().uuid(),
  user_id: z.string().uuid(),
  description: z.string(),
  priority: z.number().int().min(0).max(2),
  status: z.boolean(),
  created_at: z.date(),
  updated_at: z.date(),
  completed_at: z.date().optional(),
})

const getUserTasksOutputSchema = z.array(getTaskOutputSchema)

export type getUserTasksResponse = z.infer<typeof getUserTasksOutputSchema>

const createUserOutputSchema = z.object({
  user_id: z.string().uuid(),
  username: z.string(),
  created_at: z.date(),
})

export type createUserResponse = z.infer<typeof createUserOutputSchema>

export const updateTaskOutputSchema = z.object({
  task_id: z
    .string({
      required_error: "Task ID is required",
    })
    .uuid(),
  user_id: z
    .string({
      required_error: "User ID is required",
    })
    .uuid(),
  description: z.string({
    required_error: "Description is required",
  }),
  priority: z
    .number({
      required_error: "Priority is required",
    })
    .int()
    .min(0)
    .max(2),
  status: z.boolean(),
  created_at: z.date(),
  updated_at: z.date(),
  completed_at: z.date(),
})

export type updateTaskResponse = z.infer<typeof updateTaskOutputSchema>

const deleteTaskOutputSchema = z.object({
  task_id: z.string().uuid().nonempty(),
  user_id: z.string().uuid().nonempty(),
})
export type deleteTaskResponse = z.infer<typeof deleteTaskOutputSchema>

export const getAllTasksInputSchema = z.object({
  user_id: z.string().uuid().nonempty(),
  limit: z.number().int().min(1).max(100).default(10).optional(),
  offset: z.number().int().min(0).default(0).optional(),
})

export type getAllTasksRequest = z.infer<typeof getAllTasksInputSchema>

const taskSchema = z.object({
  task_id: z.string().uuid(),
  user_id: z.string().uuid(),
  description: z.string(),
  priority: z.number().int(),
  status: z.boolean(),
  created_at: z.date(),
  updated_at: z.date(),
  completed_at: z.date().nullable(),
})

export const getAllTasksOutputSchema = z.object({
  tasks: z.array(taskSchema),
  count: z.number().int(),
  limit: z.number().int(),
  offset: z.number().int(),
})

export type getAllTasksResponse = z.infer<typeof getAllTasksOutputSchema>

export const getAllTaskIdsInputSchema = z.object({
  user_id: z
    .string({
      required_error: "User ID is required",
    })
    .uuid()
    .nonempty(),
})

export type getAllTaskIdsRequest = z.infer<typeof getAllTaskIdsInputSchema>

export const getAllTaskIdsOutputSchema = z.object({
  task_ids: z.array(z.string().uuid()),
})

export type getAllTaskIdsResponse = z.infer<typeof getAllTaskIdsOutputSchema>
