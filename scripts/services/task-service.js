import {localRepo} from "/scripts/repo/local-repo.js"

export class TaskService{
  constructor(taskRepo) {
    if(!taskRepo){
      taskRepo = localRepo
    }

    this.storage = taskRepo
  }

  saveTask(task) {
    this.storage.saveTask(task)
  }

  updateTask(taskName, newTask){
    this.storage.updateTask(taskName, newTask)
  }
}