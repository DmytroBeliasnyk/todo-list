export const localRepo = {
  repo: localStorage,
  saveTask(newTask) {
    this.repo.setItem(newTask.name, JSON.stringify(newTask))
  },
  getTask(taskName) {
    return this.repo.getItem(taskName)
  },
  getAllTasks() {
    const result = []
    for (let i = 0; i < this.repo.length; i++) {
      let key = this.repo.key(i)
      result.push(JSON.parse(this.repo.getItem(key)))
    }

    return result
  },
  updateTask(task){
    this.repo.setItem(task.name, JSON.stringify(task))
  },
  removeTask(taskName) {
    this.repo.removeItem(taskName)
  }
}