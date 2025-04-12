export const taskService = (() => {
  const key = "tasks"
  const repo = localStorage

  let tasks = JSON.parse(repo.getItem(key) || "[]")
  let taskNamesSet = new Set(tasks.map(task => task.name))
  let taskIdSet = new Set(tasks.map(task => task.id))

  window.addEventListener("storage", () => {
    tasks = JSON.parse(repo.getItem(key) || "[]")
    taskNamesSet = new Set(tasks.map(task => task.name))
    taskIdSet = new Set(tasks.map(task => task.id))
  })

  return {
    add(task) {
      tasks.unshift(task)
      repo.setItem(key, JSON.stringify(tasks))
    },
    get() {
    },
    getAll() {
      return tasks
    },
    update() {
    },
    removeTask() {
    },
    validateTaskName(taskName) {
      const res = {
        hasError: false,
        errorMessage: '',
      }

      taskName = taskName.trim()
      if (!taskName) {
        res.hasError = true
        res.errorMessage = "Field \"name\" can't be empty."

        return res
      }

      if (taskNamesSet.has(taskName)) {
        res.hasError = true
        res.errorMessage = "Task name must be unique"
      } else {
        taskNamesSet.add(taskName)
      }

      return res
    },
    isIdUnique(taskId) {
      const isUnique = !taskIdSet.has(taskId)
      if (isUnique) taskIdSet.add(taskId)

      return isUnique
    },
  }
})()