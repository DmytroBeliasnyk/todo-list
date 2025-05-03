import {taskStorageInit} from "./components/task-storage.js";
import {taskRenderInit} from "./components/task-render.js";
import {openTaskForm} from "./components/task-form.js";
import {taskFiltersInit} from "./components/task-filters.js";

const taskStorage = taskStorageInit()
taskFiltersInit(
  taskStorage.getAll,
  (tasks) => tasksRender.renderPage(tasks)
)
const tasksRender = taskRenderInit({
  taskContainer: document.querySelector(".tasks__container"),
  callbacks: {
    edit: (task, renderCallback) => openTaskForm({
      action: "edit",
      task: task,
      formEditCallback: (editedTask) => {
        editedTask.id = task.id
        editedTask.status = task.status

        taskStorage.update(editedTask)
        renderCallback(editedTask)
      },
    }),
    done: (task, renderCallback) => {
      taskStorage.update(task)
      renderCallback()
    },
    remove: (task, renderCallback) => {
      taskStorage.remove(task)
      renderCallback()
    },
  },
})
tasksRender.renderPage(taskStorage.getAll())

const loaderObserver = new IntersectionObserver(
  (entries) => {
    if (entries[0].isIntersecting) tasksRender.renderNextPage()
  },
  {
    root: document.querySelector(".tasks"),
    threshold: 0.1,
  }
)
loaderObserver.observe(document.querySelector("#tasks__loader"))

window.addEventListener("storage", () => {
  tasksRender.renderPage(taskStorage.getAll())
})

document.querySelector(".open-task-form-add-task")
  .addEventListener("click", () => {
    openTaskForm({
      action: "add",
      formAddCallback: (task) => {
        task.id = crypto.randomUUID()

        taskStorage.add(task)
        tasksRender.addTask(task)
      },
    })
  })
