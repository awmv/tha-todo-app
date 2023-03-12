import axios from "axios"
import {
  createTaskRequest,
  createTaskResponse,
  deleteTaskRequest,
  deleteTaskResponse,
  getAllTasksResponse,
  updateTaskRequest,
  updateTaskResponse,
} from "~~/schemas/user"

const API_BASE_URL = process.env.API_BASE_URL || "http://localhost:3002/api/v1"

axios.defaults.baseURL = API_BASE_URL

export const createTaskForUser = async (task: createTaskRequest) => {
  try {
    const response = await axios.post(`/user/${task.user_id}/task`, {
      description: task.description,
    })
    return response.data as createTaskResponse
  } catch (error) {
    console.error(error)
    throw error
  }
}

export const deleteTaskForUser = async (task: deleteTaskRequest) => {
  try {
    const response = await axios.delete(
      `/user/${task.user_id}/task/${task.task_id}`
    )
    return response.data as deleteTaskResponse
  } catch (error) {
    console.error(error)
    throw error
  }
}

export const updateTaskForUser = async (task: updateTaskRequest) => {
  try {
    const response = await axios.put(
      `/user/${task.user_id}/task/${task.task_id}`,
      {
        description: task.description,
        status: task.status,
      }
    )
    return response.data as updateTaskResponse
  } catch (error) {
    console.error(error)
    throw error
  }
}

export const getAllTasksForUser = async (user_id: string) => {
  try {
    const response = await axios.get(`/user/${user_id}/tasks`)
    return response.data as getAllTasksResponse
  } catch (error) {
    console.error(error)
    throw error
  }
}

export const getAllTaskIdsForUser = async (user_id: string) => {
  try {
    const response = await axios.get(`/user/${user_id}/task-ids`)
    return response.data as { task_ids: string[] }
  } catch (error) {
    console.error(error)
    throw error
  }
}
