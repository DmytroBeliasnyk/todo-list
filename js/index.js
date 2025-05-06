import {taskStorage} from "./services/entities/task-storage.js";
import {taskRenderInit} from "./components/tasks/render.js";
import {openTaskForm, taskFormInit} from "./components/tasks/form.js";
import {taskFiltersInit} from "./components/tasks/filters.js";
import {formConstants} from "./utils/constants.js";

const tasksRender = taskRenderInit({
  taskContainer: document.querySelector(".tasks__container"),
  callbacks: {
    edit: (task, renderCallback) => openTaskForm({
      action: formConstants.actions.editTask,
      task: task,
      formSubmitCallback: (editedTask) => {
        editedTask.id = task.id
        editedTask.status = task.status

        taskStorage.update(editedTask)
        renderCallback(editedTask)
      },
    }),
  },
})
let renderNextPage = tasksRender.renderPage(taskStorage.getAll())

taskFormInit(
  task => {
    taskStorage.add(task)
    tasksRender.addTask(task)
  })

taskFiltersInit(
  taskStorage.getAll,
  tasks => {
    renderNextPage = tasksRender.renderPage(tasks)
  }
)

const loaderObserver = new IntersectionObserver(
  (entries) => {
    if (entries[0].isIntersecting) {
      renderNextPage()
    }
  },
  {
    root: document.querySelector(".tasks"),
    threshold: 0.1,
  }
)
loaderObserver.observe(document.querySelector("#tasks__loader"))

window.addEventListener("storage", () => {
  renderNextPage = tasksRender.renderPage(taskStorage.getAll())
})