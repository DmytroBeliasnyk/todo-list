import {taskStorage} from "./services/task-storage.js";
import {taskRenderInit} from "./components/tasks/render.js";
import {openTaskForm, taskFormInit} from "./components/tasks/form.js";
import {taskFiltersInit} from "./components/tasks/filters.js";
import {constants} from "./utils/constants.js";

const tasksRender = taskRenderInit({
  taskContainer: document.querySelector(".tasks__container"),
  callbacks: {
    edit: (task, renderCallback) => openTaskForm({
      action: constants.form.actions.editTask,
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

taskFormInit(
  task => {
    taskStorage.add(task)
    tasksRender.addTask(task)
  })

taskFiltersInit(
  taskStorage.getAll,
  tasks => tasksRender.renderPage(tasks)
)


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

