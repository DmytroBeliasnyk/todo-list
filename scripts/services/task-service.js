import {localRepo} from "/scripts/repo/local-repo.js"

export class TaskService {
  constructor(taskRepo) {
    if (!taskRepo) {
      taskRepo = localRepo
    }

    this.storage = taskRepo
  }

  toHtmlElement(task) {
    const taskName = document.createElement("div")
    taskName.className = "content__task-name"
    taskName.textContent = task.name

    const taskDescription = document.createElement("div")
    taskDescription.className = "content__task-description"
    taskDescription.textContent = task.description

    const taskText = document.createElement("div")
    taskText.className = "content__task-text"
    taskText.appendChild(taskName)
    taskText.appendChild(taskDescription)

    const deadlineText = document.createElement("p")
    deadlineText.textContent = "Deadline:"

    const deadlineDate = document.createElement("time")
    deadlineDate.className = "task-deadline"
    deadlineDate.textContent = task.deadline

    const deadlineDateContainer = document.createElement("p")
    deadlineDateContainer.appendChild(deadlineDate)

    const taskExpire = document.createElement("div")
    taskExpire.className = "content__task-expire"
    taskExpire.appendChild(deadlineText)
    taskExpire.appendChild(deadlineDateContainer)

    const taskHtmlElement = document.createElement("div")
    taskHtmlElement.className = "content__task"
    if (task.done) taskHtmlElement.classList.add("done")

    taskHtmlElement.appendChild(taskText)
    taskHtmlElement.appendChild(taskExpire)

    return taskHtmlElement
  }

  toObject(htmlElement) {
    return {
      name: htmlElement.querySelector(".content__task-name").textContent,
      description: htmlElement.querySelector(".content__task-description").textContent,
      deadline: htmlElement.querySelector(".task-deadline").textContent,
    }
  }

  saveTask(task) {
    this.storage.saveTask(task)
  }

  getTask(taskName) {
    return this.storage.getTask(taskName)
  }

  getAllTasks() {
    return this.storage.getAllTasks()
  }

  updateTask(task) {
    this.storage.updateTask(task)
  }

  removeTask(taskName) {
    this.storage.removeTask(taskName)
  }
}