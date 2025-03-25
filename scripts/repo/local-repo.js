export const localRepo = {
  repo: localStorage,
  saveTask(newTask) {
    this.repo.setItem(newTask.name, JSON.stringify(newTask))
  },
  getTask(taskName){
    return this.repo.getItem(taskName)
  },
  removeTask(taskName){
    this.repo.removeItem(taskName)
  }
}