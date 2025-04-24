import {taskService} from "./services/task.js";
import RenderService from "./services/render.js";
import {filterService} from "./services/filter.js"
import FormService from "./services/form.js";
import {debounce} from "./utils/debounce.js";

const taskContainer = document.querySelector(".tasks")
const tasksLoader = taskContainer.querySelector("#tasks-loader")
const renderService = RenderService(taskContainer, tasksLoader)
const loaderObserver = new IntersectionObserver(
  () => {
    console.log("observe")
    renderService.renderPage()
  },
  {
    root: taskContainer,
    threshold: 0.1,
  }
)

renderService.renderPage(taskService.getAll())
loaderObserver.observe(tasksLoader)

window.addEventListener("storage", () => {
  renderService.renderPage(taskService.getAll())
})

document.querySelector(".navigation__search")
  .addEventListener("input", event => {
    debounce((target) => {
      renderService.renderPage(
        filterService.search(taskService.getAll(), target),
        true
      )
    }, 250)(event.target)
  })

document.querySelector(".navigation__filters")
  .addEventListener("click", event => {
    const target = event.target.closest(".filter")
    if (!target) return

    renderService.renderPage(
      filterService.filter(taskService.getAll(), target),
      true
    )
  })

const modal = document.querySelector(".modal")
const modalContainer = modal.parentNode

const taskForm = document.forms.taskForm
const formService = FormService(taskForm)

const openFormButton = document.querySelector(".open-form")
openFormButton.addEventListener("click", () => {
  modalContainer.classList.add("active")
  modal.classList.add("add")
  taskForm.elements.name.focus()

  formService.init(
    task => {
      const validName = taskService.validateTaskName(task.name)
      if (validName.hasError) {
        formService.setError(validName.errorMessage)
        return
      }

      taskService.add(task)
      renderService.renderTask(task)

      taskForm.reset()
    },
    () => {
      modalContainer.classList.remove("active")
      modal.classList.remove("add")
    }
  )
})

taskContainer.addEventListener("update-description", event => {
  const taskElement = event.detail.taskElement
  const task = event.detail.task

  task.description = taskElement.querySelector(".task__description").value

  taskService.update(task)
})
taskContainer.addEventListener("done-task", event => {
  const task = event.detail.task
  task.status = "Done"

  taskService.update(task)
  renderService.updateTaskStatus(event.detail.taskElement)
})
taskContainer.addEventListener("remove-task", event => {
  taskService.remove(event.detail.task)
  renderService.removeTask(event.detail.taskElement)
})