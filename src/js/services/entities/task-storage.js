import {TASK_STATUS, TASK_STORAGE_KEY} from "@/utils/constants.js";

export function taskStorageInit(repo = localStorage, key = TASK_STORAGE_KEY) {
  let tasks = JSON.parse(repo.getItem(key) || "[]")

  if (typeof window !== "undefined") {
    window.addEventListener("storage", () => {
      tasks = JSON.parse(repo.getItem(key) || "[]")
    })
  }

  return {
    add(task) {
      if (!task.name || !task.name.trim()) {
        throw new Error(`Task name must be specific: ${JSON.stringify(task)}.`)
      }
      if (!task.id) {
        throw new Error(`Task id must be specific: ${JSON.stringify(task)}.`)
      }

      task.status = TASK_STATUS.IN_PROGRESS

      tasks.unshift(task)
      repo.setItem(key, JSON.stringify(tasks))
    },
    getAll() {
      return [].concat(tasks)
    },
    update(task) {
      if (!task.id) {
        throw new Error(`Task id must be specific: ${JSON.stringify(task)}.`)
      }

      if (!task.name.trim()) {
        throw new Error(`Task name must be specific: ${JSON.stringify(task)}.`)
      }

      const oldTask = tasks.find(oldTask => oldTask.id === task.id)
      if (!oldTask) {
        throw new Error(`Not founded task with id: ${task.id}`)
      }

      oldTask.name = task.name.trim()
      oldTask.description = task.description
      oldTask.status = task.status ?? TASK_STATUS.IN_PROGRESS

      repo.setItem(key, JSON.stringify(tasks))
    },
    remove(task) {
      if (!task || typeof task.id === "undefined") {
        throw new Error(`Task id must be specific: ${JSON.stringify(task)}.`)
      }

      const index = tasks.findIndex(findTask => findTask.id === task.id)
      if (index === -1) {
        throw new Error(`Not found task with id${task.id}`)
      }

      tasks.splice(index, 1)
      repo.setItem(key, JSON.stringify(tasks))
    },
  }
}