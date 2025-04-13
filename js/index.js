import createClient from "./services/client.js";
import {taskService} from "./services/task.js";
import RenderService from "./services/render.js";
import FormService from "./services/form.js";
import {debounce} from "./services/debounce.js";
import {throttle} from "./services/throttle.js";

const taskContainer = document.querySelector(".tasks")
const renderService = RenderService(taskContainer)
let client = createClient(taskService.getAll())

renderService.appendTasks(client.getFirstPage())
window.addEventListener("storage", () => {
  renderService.renderAll(
    createClient(taskContainer, taskService.getAll()).getFirstPage()
  )
})

function createThrottleScrollHandler(client) {
  return throttle(() => {
    const nextPage = client.getNextPage()
    if (nextPage) {
      renderService.appendTasks(nextPage)
    }
  }, 250)
}

let currentScrollHandler = createThrottleScrollHandler(client)
taskContainer.addEventListener("scroll", currentScrollHandler)

const search = document.querySelector(".navigation__search")
const debouncedSearch = debounce((value) => {
  client = createClient(taskService.findByName(value))
  renderService.renderAll(client.getFirstPage())

  taskContainer.removeEventListener("scroll", currentScrollHandler)

  currentScrollHandler = createThrottleScrollHandler(client)
  taskContainer.addEventListener("scroll", currentScrollHandler)
}, 250)
search.addEventListener("input", event => {
  debouncedSearch(event.target.value.trim().toLowerCase())
})

const switchFilter = (filter) => {
  const isEnabled = filter.classList.contains("enabled")

  for (const filter of document.querySelectorAll(".enabled")) {
    filter.classList.remove("enabled")
  }

  filter.classList.toggle("enabled", !isEnabled)
  return isEnabled
}

const filterInProgress = document.querySelector("#filter-in-progress")
filterInProgress.addEventListener("click", event => {
  const filter = event.target.closest(".filter")
  const tasks = taskService.getAll()
  taskContainer.removeEventListener("scroll", currentScrollHandler)

  const filteredTasks = switchFilter(filter)
    ? tasks
    : tasks.filter(task => task.status === "In progress")

  client = createClient(filteredTasks)

  renderService.renderAll(client.getFirstPage())

  currentScrollHandler = createThrottleScrollHandler(client)
  taskContainer.addEventListener("scroll", currentScrollHandler)
})

const filterDone = document.querySelector("#filter-done")
filterDone.addEventListener("click", event => {
  const filter = event.target.closest(".filter")
  const tasks = taskService.getAll()
  taskContainer.removeEventListener("scroll", currentScrollHandler)

  const filteredTasks = switchFilter(filter)
    ? tasks
    : tasks.filter(task => task.status === "Done")

  client = createClient(filteredTasks)

  renderService.renderAll(client.getFirstPage())

  currentScrollHandler = createThrottleScrollHandler(client)
  taskContainer.addEventListener("scroll", currentScrollHandler)
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