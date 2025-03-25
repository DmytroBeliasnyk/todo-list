export const localRepo = {
  repo: localStorage,
  saveTask(newTask) {
    this.repo.setItem(newTask.name, JSON.stringify(newTask))
  },
}