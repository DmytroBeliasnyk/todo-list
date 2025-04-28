import {taskService} from "./services/task.js";
import RenderService from "./services/render.js";
import {debounce} from "./utils/debounce.js";
import {filterService} from "./services/filter.js"
import {filters} from "./utils/filters.js";
import FormService from "./services/form.js";

const renderService = RenderService({
  taskContainer: document.querySelector(".tasks__container"),
  callbacks: {
    edit: (task, renderCallback) => openTaskFormToEdit(task, renderCallback),
    done: (task, renderCallback) => {
      taskService.update(task)
      renderCallback()
    },
    remove: (task, renderCallback) => {
      taskService.remove(task)
      renderCallback()
    },
  },
})
// for (let i = 1; i <= 100; i++) {
//   let description = ''
//   if (i % 2 === 0) {
//     description = "description" + i
//   }
//
//   let id
//   do {
//     id = crypto.randomUUID()
//   } while (!taskService.validateId(id))
//
//   taskService.add({name: "task" + i, description: description, id: id,})
// }
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
      if (!task.name.trim()) {
        formService.setError("Field \"name\" can't be empty.")
        return
      }

      let id
      do {
        id = crypto.randomUUID()
      } while (!taskService.validateId(id))
      task.id = id

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

function openTaskFormToEdit(task, renderCallback) {
  modalContainer.classList.add("active")
  modal.classList.add("edit")

  taskForm.elements.name.value = task.name
  taskForm.elements.description.value = task.description
  const taskId = task.id

  formService.init(
    task => {
      if (!task.name.trim()) {
        formService.setError("Field \"name\" can't be empty.")
        return
      }
      task.id = taskId

      taskService.update(task)
      renderCallback(task)

      taskForm.reset()
    },
    () => {
      modalContainer.classList.remove("active")
      modal.classList.remove("edit")
    }
  )
}