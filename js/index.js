import {taskService} from "./services/task.js";
import RenderService from "./services/render.js";
import {openTaskForm} from "./components/task-form.js";
import {navigationInit} from "./components/task-navigation.js";

const renderService = RenderService({
  taskContainer: document.querySelector(".tasks__container"),
  callbacks: {
    edit: (task, renderCallback) => openTaskForm({
      action: "edit",
      task: task,
      formEditCallback: (editedTask) => {
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
window.addEventListener("storage", () => {
  renderService.renderPage(taskService.getAll())
})

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

navigationInit(
  taskService.getAll,
  (tasks) => renderService.renderPage(tasks)
)

document.querySelector(".open-task-form-add-task")
  .addEventListener("click", () => {
    openTaskForm({
      action: "add",
      formAddCallback: (task) => {
        task.id = crypto.randomUUID()

        taskService.add(task)
        renderService.addTask(task)
      },
    })
  })
