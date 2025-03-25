import {localRepo} from "/scripts/repo/local-repo.js"

export class TaskService {
  constructor(taskRepo) {
    if (!taskRepo) {
      taskRepo = localRepo
    }

    this.storage = taskRepo
  }

  saveTask(task) {
    this.storage.saveTask(task)
  }

  getTask(taskName) {
    return this.storage.getTask(taskName)
  }

  removeTask(taskName) {
    this.storage.removeTask(taskName)
  }
}