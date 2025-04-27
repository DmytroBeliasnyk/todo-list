import {taskService} from "./services/task.js";
import RenderService from "./services/render.js";
import {debounce} from "./utils/debounce.js";
import {filterService} from "./services/filter.js"
import {filters} from "./utils/filters.js";
import FormService from "./services/form.js";

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
      filterService.setFilter(
        target.id,
        tasks => filters.get(target.id)(tasks, target.value.trim())
      )

      renderService.renderPage(
        filterService.applyFilters(taskService.getAll())
      )
    }, 250)(event.target)
  })

document.querySelector(".navigation__filters")
  .addEventListener("click", event => {
    const targetFilter = event.target.closest(".filter")
    if (!targetFilter) return

    if (targetFilter.classList.contains("enabled")) {
      targetFilter.classList.remove("enabled")
      filterService.removeFilter(targetFilter.id)
    } else {
      for (const enabledFilter of document.querySelectorAll(".enabled")) {
        if (!enabledFilter.dataset.enabledTogether && !targetFilter.dataset.enabledTogether) {
          enabledFilter.classList.remove("enabled")
          filterService.removeFilter(enabledFilter.id)
        }
      }

      targetFilter.classList.add("enabled")
      filterService.setFilter(
        targetFilter.id,
        tasks => filters.get(targetFilter.id)(tasks)
      )
    }

    renderService.renderPage(
      filterService.applyFilters(taskService.getAll())
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