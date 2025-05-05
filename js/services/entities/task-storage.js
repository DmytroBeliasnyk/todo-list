import {taskStorageKey, tasksStatuses} from "../../utils/constants.js";

export const taskStorage = (() => {
  const key = taskStorageKey
  const repo = localStorage

  let tasks = JSON.parse(repo.getItem(key) || "[]")

  window.addEventListener("storage", () => {
    tasks = JSON.parse(repo.getItem(key) || "[]")
  })

  return {
    add(task) {
      task.status = tasksStatuses.inProgress

      tasks.unshift(task)
      repo.setItem(key, JSON.stringify(tasks))
    },
    getAll() {
      return [].concat(tasks)
    },
    update(task) {
      const oldTask = tasks.find(oldTask => oldTask.id === task.id)

      oldTask.name = task.name
      oldTask.description = task.description
      oldTask.status = task.status

      repo.setItem(key, JSON.stringify(tasks))
    },
    remove(task) {
      const index = tasks.findIndex(findTask => findTask.id === task.id)
      tasks.splice(index, 1)

      repo.setItem(key, JSON.stringify(tasks))
    },
  }
})()