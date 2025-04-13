export const taskService = (() => {
  const key = "tasks"
  const repo = localStorage

  let tasks = JSON.parse(repo.getItem(key) || "[]")
  let taskNamesSet = new Set(tasks.map(task => task.name))

  window.addEventListener("storage", () => {
    tasks = JSON.parse(repo.getItem(key) || "[]")
    taskNamesSet = new Set(tasks.map(task => task.name))
  })

  return {
    add(task) {
      task.status = "In progress"

      tasks.unshift(task)
      repo.setItem(key, JSON.stringify(tasks))
    },
    findByName(taskName) {
      if (taskName === "") return tasks

      return tasks.filter(findTask => findTask.name.toLowerCase().includes(taskName))
    },
    getAll() {
      return tasks
    },
    update(task) {
      const oldTask = tasks.find(oldTask => oldTask.name === task.name)
      oldTask.description = task.description
      oldTask.status = task.status ?? "In progress"

      repo.setItem(key, JSON.stringify(tasks))
    },
    removeByName(taskName) {
      const index = tasks.findIndex(findTask => findTask.name === taskName)
      tasks.splice(index, 1)

      repo.setItem(key, JSON.stringify(tasks))
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
  }
})()