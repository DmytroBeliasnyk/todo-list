import {taskService} from "./services/task.js";
import RenderService from "./services/render.js";
import FilterService from "./services/filter.js"
import FormService from "./services/form.js";
import {debounce} from "./utils/debounce.js";
import {throttle} from "./utils/throttle.js";

const taskContainer = document.querySelector(".tasks")
const tasksLoader = taskContainer.querySelector("#tasks-loader")
const renderService = RenderService(taskContainer, tasksLoader)
const loaderObserver = new IntersectionObserver(
  () => renderService.renderPage(),
  {
    root: taskContainer,
    rootMargin: "0px",
    threshold: 0.1,
  }
)

renderService.renderPage(taskService.getAll())
loaderObserver.observe(tasksLoader)

window.addEventListener("storage", () => {
  renderService.renderPage(taskService.getAll())
})


// const throttleScrolling = throttle(() => {
//   console.log(taskContainer.clientHeight + taskContainer.scrollTop >= taskContainer.scrollHeight)
//   if (taskContainer.clientHeight + taskContainer.scrollTop >= taskContainer.scrollHeight) {
//     renderService.renderPage()
//   }
// }, 250)
// taskContainer.addEventListener("scroll", throttleScrolling)
// function createThrottleScrollHandler(client) {
//   return throttle(() => {
//     const nextPage = client.getNextPage()
//     if (nextPage) {
//       renderService.appendTasks(nextPage)
//     }
//   }, 250)
// }
//
// let currentScrollHandler = createThrottleScrollHandler(client)
// taskContainer.addEventListener("scroll", currentScrollHandler)
//
// const filters = document.querySelectorAll(".filter")
// const search = document.querySelector(".navigation__search")
//
// const filterService = FilterService(filters)
// for (const filter of filters) {
//   filter.addEventListener("click", event => {
//     const filter = event.target.closest(".filter")
//
//     let tasks = taskService.getAll()
//
//     const searchInput = search.value.trim()
//     if (searchInput) {
//       tasks = filterService.filterByTaskName(tasks, searchInput)
//     }
//     if (!filterService.switchFilter(filter)) {
//       tasks = filterService.filter(tasks, filter.id)
//     }
//
//     client = createClient(tasks)
//     renderService.renderAll(client.getFirstPage())
//
//     taskContainer.removeEventListener("scroll", currentScrollHandler)
//
//     currentScrollHandler = createThrottleScrollHandler(client)
//     taskContainer.addEventListener("scroll", currentScrollHandler)
//   })
// }
//
// const debouncedSearch = debounce((value) => {
//   let tasks = taskService.getAll()
//   if (value) {
//     tasks = filterService.filterByTaskName(tasks, value)
//   }
//
//   const enabledFilters = document.querySelectorAll(".enabled")
//   if (enabledFilters) {
//     for (const filter of enabledFilters) {
//       tasks = filterService.filter(tasks, filter.id)
//     }
//   }
//
//   client = createClient(tasks)
//   renderService.renderAll(client.getFirstPage())
//
//   taskContainer.removeEventListener("scroll", currentScrollHandler)
//
//   currentScrollHandler = createThrottleScrollHandler(client)
//   taskContainer.addEventListener("scroll", currentScrollHandler)
// }, 250)
// search.addEventListener("input", event => {
//   debouncedSearch(event.target.value.trim())
// })

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