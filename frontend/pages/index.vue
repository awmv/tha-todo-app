<template>
  <v-container fluid class="fade-in">
    <v-row no-gutters>
      <v-col cols="12" md="6" offset-md="3">
        <v-row align="center">
          <v-col cols="6">
            <h1>Hello, {{ username }} <span class="wave">👋</span></h1>
          </v-col>
          <v-col cols="6" class="text-right">
            <v-row v-if="todos.length > 0">
              <v-col cols="12" class="text-center">
                <v-chip
                  color="primary"
                  :class="{
                    'primary white--text': visibility === 'all',
                    'active-filter': visibility === 'all',
                  }"
                  @click="setVisibility('all')"
                  >All</v-chip
                >
                <v-chip
                  color="primary"
                  :class="{
                    'primary white--text': visibility === 'active',
                    'active-filter': visibility === 'active',
                  }"
                  @click="setVisibility('active')"
                  >Active</v-chip
                >
                <v-chip
                  color="primary"
                  :class="{
                    'primary white--text': visibility === 'completed',
                    'active-filter': visibility === 'completed',
                  }"
                  @click="setVisibility('completed')"
                  >Completed</v-chip
                >
              </v-col>
            </v-row>
          </v-col>
        </v-row>
        <div style="position: relative">
          <v-text-field
            v-model="newTodo"
            label="Add a task"
            @keyup.enter="addTodo"
            prepend-inner-icon="mdi-plus"
            dense
            hide-details
          >
          </v-text-field>
          <v-progress-linear
            v-if="todos.length > 0"
            v-model="completion_percentage"
            color="primary"
            height="8"
            rounded
            class="rounded-full"
          >
          </v-progress-linear>
        </div>

        <v-list v-if="todos.length > 0" dense>
          <v-list-item v-for="todo in filteredTodos" :key="todo.task_id">
            <v-row align="center" class="align-items-center">
              <v-col cols="1">
                <v-checkbox
                  v-model="todo.status"
                  color="primary"
                  @click="updateTaskStatus(todo)"
                  dense
                  style="display: flex; align-items: center"
                ></v-checkbox>
              </v-col>
              <v-col cols="10">
                <v-list-item-title :class="{ completed: todo.status }">
                  {{ todo.description }}
                </v-list-item-title>
              </v-col>
              <v-col cols="1">
                <v-icon @click.stop="removeTodo(todo)" dense>mdi-delete</v-icon>
              </v-col>
            </v-row>
          </v-list-item>
        </v-list>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { defineComponent } from "vue"
import { createTaskRequest, deleteTaskRequest } from "~~/schemas/user"
import * as api from "~~/services/user.service"

type Task = {
  user_id: string
  task_id: string
  description: string
  status: boolean
  editing: boolean
  pending: boolean
}
const USER_ID = "33c17e0e-ec23-44d1-a19e-00f3a07e2a77"

export default defineComponent({
  name: "Todo",
  data() {
    return {
      username: "Marcel",
      todos: [] as Task[],
      newTodo: "",
      visibility: "active" as "active" | "completed" | "all",
      completion_percentage: 0,
    }
  },
  methods: {
    async getAllTasks() {
      try {
        const tasks = await api.getAllTasksForUser(USER_ID)
        this.todos = tasks.tasks.map((task) => ({
          user_id: USER_ID,
          task_id: task.task_id,
          description: task.description,
          status: task.status,
          editing: false,
          pending: false,
        }))
      } catch (error: unknown) {
        console.error("Error getting tasks:", error)
      }
    },
    async addTodo() {
      if (!this.newTodo.trim()) return

      const taskRequest = {
        description: this.newTodo.trim(),
        user_id: USER_ID,
      } as createTaskRequest
      try {
        const createTaskPayload = await api.createTaskForUser(taskRequest)
        const newTask: Task = {
          user_id: USER_ID,
          task_id: createTaskPayload.task_id,
          description: this.newTodo.trim(),
          status: false,
          editing: false,
          pending: false,
        }
        this.todos.push(newTask)
      } catch (error: unknown) {
        console.error("Error creating task:", error)
        this.todos.push({
          user_id: USER_ID,
          task_id: crypto.randomUUID(),
          description: this.newTodo.trim(),
          status: false,
          editing: false,
          pending: true,
        })
      } finally {
        this.newTodo = ""
      }
    },
    async removeTodo(todo: Task) {
      const index = this.todos.indexOf(todo)
      if (index !== -1) this.todos.splice(index, 1)
      const taskRequest = {
        task_id: todo.task_id,
        user_id: USER_ID,
      } as deleteTaskRequest
      try {
        await api.deleteTaskForUser(taskRequest)
      } catch (error: unknown) {
        console.error("Error deleting task:", error)
      }
    },

    setVisibility(visibility: "active" | "completed" | "all") {
      this.visibility = visibility
    },
    async updateTaskStatus(todo: Task) {
      const taskRequest = {
        user_id: todo.user_id,
        task_id: todo.task_id,
        description: todo.description,
        status: !todo.status,
        pending: false,
      } as Task

      try {
        const updatedTask = await api.updateTaskForUser(taskRequest)
      } catch (error: unknown) {
        console.error("Error updating task:", error)
        const index = this.todos.indexOf(todo)

        taskRequest.pending = true
        this.todos[index] = taskRequest
      }
    },
    setTaskCompletion() {
      if (this.todos.length === 0) return (this.completion_percentage = 0)
      const completedTasks = this.todos.filter((todo) => todo.status)
      const percentage = (completedTasks.length / this.todos.length) * 100
      this.completion_percentage = percentage
    },
  },
  watch: {
    todos: {
      handler() {
        this.setTaskCompletion()
      },
      deep: true,
    },
  },
  computed: {
    filteredTodos() {
      switch (this.visibility) {
        case "active":
          return this.todos.filter((todo) => !todo.status)
        case "completed":
          return this.todos.filter((todo) => todo.status)
        case "all":
          return this.todos
      }
    },
  },
  mounted() {
    this.getAllTasks()
  },
})
</script>
<style scoped>
.active-filter {
  background-color: #3e23c4;
  color: white !important;
}
</style>
