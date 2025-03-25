export const localRepo = {
  repo: localStorage,
  saveTask(newTask) {
    this.repo.setItem(newTask.name, JSON.stringify(newTask))
  },
  updateTask(taskName, newTask){
    if(taskName === newTask.name) {
      this.repo.setItem(taskName, JSON.stringify(newTask))
      return
    }

    this.repo.removeItem(taskName)
    this.repo.setItem(newTask.name, JSON.stringify(newTask))
  },
}