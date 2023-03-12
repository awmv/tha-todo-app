import { createTaskHandler } from "./user.controller"
import * as db from "../db/user.db"

jest.mock("../db/user.db")

describe("createTaskHandler", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })
  it("201 - should create a new task", async () => {
    const user_id = "user_id"
    const description = "task_description"

    const req = { params: { user_id }, body: { description } }
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    }

    const expectedTask = {
      id: 1,
      description,
      user_id,
    }
    ;(db.createTask as jest.Mock).mockResolvedValueOnce(expectedTask)

    await createTaskHandler(req as any, res as any)

    expect(db.createTask).toHaveBeenCalledTimes(1)
    expect(db.createTask).toHaveBeenCalledWith({
      description,
      user_id,
    })
    expect(res.status).toHaveBeenCalledWith(201)
    expect(res.json).toHaveBeenCalledWith(expectedTask)
  })

  it("404 if the user does not exist", async () => {
    const user_id = "user_id"
    const description = "task_description"

    const req = { params: { user_id }, body: { description } }
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    }

    ;(db.createTask as jest.Mock).mockRejectedValueOnce(
      new Error("User does not exist")
    )

    await createTaskHandler(req as any, res as any)

    expect(db.createTask).toHaveBeenCalledTimes(1)
    expect(db.createTask).toHaveBeenCalledWith({
      description,
      user_id,
    })
    expect(res.status).toHaveBeenCalledWith(404)
    expect(res.json).toHaveBeenCalledWith({ error: "User not found" })
  })

  it("500 response when an error occurs", async () => {
    const user_id = "user_id"
    const description = "task_description"

    const req = { params: { user_id }, body: { description } }
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    }

    ;(db.createTask as jest.Mock).mockRejectedValueOnce(new Error("Some error"))

    await createTaskHandler(req as any, res as any)

    expect(db.createTask).toHaveBeenCalledTimes(1)
    expect(db.createTask).toHaveBeenCalledWith({
      description,
      user_id,
    })
    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.json).toHaveBeenCalledWith({ error: "Internal Server Error" })
  })
})
