import {taskService} from "./services/task.js";
import RenderService from "./services/render.js";
import {openTaskForm} from "./components/task-form.js";
import {debounce} from "./utils/debounce.js";
import {filterService} from "./services/filter.js"
import {filters} from "./utils/filters.js";

const renderService = RenderService({
  taskContainer: document.querySelector(".tasks__container"),
  callbacks: {
    edit: (task, renderCallback) => openTaskForm({
      action: "edit",
      task: task,
      editCallback: (editedTask) => {
        editedTask.id = task.id
        editedTask.status = task.status

        taskService.update(editedTask)
        renderCallback(editedTask)
      },
    }),
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

renderService.renderPage(taskService.getAll())

const loaderObserver = new IntersectionObserver(
  (entries) => {
    if (entries[0].isIntersecting) renderService.renderNextPage()
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
      for (const enabledFilter of event.currentTarget.querySelectorAll(".enabled")) {
        console.log(enabledFilter.dataset, targetFilter.dataset)
        if (
          enabledFilter.dataset.hasOwnProperty('enabledTogether') &&
          targetFilter.dataset.hasOwnProperty('enabledTogether')
        ) {
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

document.querySelector(".open-task-form-add-task")
  .addEventListener("click", ()=>{
    openTaskForm({
      action: "add",
      addCallback: (task)=>{
        task.id = crypto.randomUUID()

        taskService.add(task)
        renderService.addTask(task)
      },
    })
  })
