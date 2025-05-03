export function taskStorageInit() {
  const key = "tasks"
  const repo = localStorage

  let tasks = JSON.parse(repo.getItem(key) || "[]")
  let taskIdsSet = new Set(tasks.map(task => task.id))

  window.addEventListener("storage", () => {
    tasks = JSON.parse(repo.getItem(key) || "[]")
    taskIdsSet = new Set(tasks.map(task => task.id))
  })

  return {
    add(task) {
      task.status = "In progress"

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
}