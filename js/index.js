import {taskService} from "./services/task.js";
import RenderService from "./services/render.js";
import {filterService} from "./services/filter.js"
import FormService from "./services/form.js";
import {debounce} from "./utils/debounce.js";

const renderService = RenderService({
  taskContainer: document.querySelector(".tasks__container"),
  callbacks: {
    edit: (task) => taskService.update(task),
    done: (task) => taskService.update(task),
    remove: (task) => taskService.remove(task),
  },
})
renderService.renderPage(taskService.getAll())

const loaderObserver = new IntersectionObserver(
  (entries) => {
    if (entries[0].isIntersecting) {
      console.log("observe")
      renderService.renderNextPage()
    }
  },
  {
    root: document.querySelector(".tasks"),
    threshold: 0.1,
  }
)
loaderObserver.observe(document.querySelector("#tasks__loader"))

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

const openTaskFormButton = document.querySelector(".open-task-form")
openTaskFormButton.addEventListener("click", () => {
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
      renderService.addTask(task)

      taskForm.reset()
    },
    () => {
      modalContainer.classList.remove("active")
      modal.classList.remove("add")
    }
  )
})