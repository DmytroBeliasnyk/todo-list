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

const openFormButton = document.querySelector(".open-form-btn")
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

const formDoneButton = taskForm.querySelector(".form__done-btn")
formDoneButton.addEventListener("click", () => {
  taskForm.dispatchEvent(new CustomEvent("done"))
})

const formRemoveButton = taskForm.querySelector(".form__remove-btn")
formRemoveButton.addEventListener("click", () => {
  taskForm.dispatchEvent(new CustomEvent("remove"))
})

taskContainer.addEventListener("click", event => {
  const targetButton = event.target.closest(".task__edit")
  if (!targetButton) return

  const targetTask = targetButton.closest(".task")
  const taskName = taskForm.elements.name

  taskName.value = targetTask.querySelector(".task__name").textContent
  taskForm.elements.description.value = targetTask.querySelector(".task__description").textContent

  taskName.disabled = true
  taskName.classList.add("disabled")

  modalContainer.classList.add("active")
  modal.classList.add("edit")

  formService.init(
    task => {
      taskService.update(task)
      renderService.updateTask(task)

      taskForm.reset()
    },
    () => {
      modalContainer.classList.remove("active")
      modal.classList.add("remove")

      taskName.disabled = false
      taskName.classList.remove("disabled")
    },
    task => {
      task.status = "Done"
      taskService.update(task)
      renderService.updateTask(task)

      targetTask.classList.add("done")
      taskForm.reset()
    },
    task => {
      taskService.removeByName(task.name)
      renderService.removeTaskByName(task.name)

      taskForm.reset()
    }
  )
})
taskContainer.addEventListener("click", event => {
  const targetButton = event.target.closest(".task__remove")
  if (!targetButton) return

  const taskName = targetButton.closest(".task")
    .querySelector(".task__name").textContent

  taskService.removeByName(taskName)
  renderService.removeTaskByName(taskName)
})