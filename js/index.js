import {taskStorageInit} from "./services/entities/task-storage.js";
import {taskRenderInit} from "./components/tasks/render.js";
import {openTaskForm, taskFormInit} from "./components/tasks/form.js";
import {taskFiltersInit} from "./components/tasks/filters.js";
import {FORM_CONSTANTS} from "./utils/constants.js";
import {openTaskActionsForm} from "./components/tasks/actions-form.js";

const taskStorage = taskStorageInit()
const tasksRender = taskRenderInit({
  taskContainer: document.querySelector(".tasks__container"),
  callbacks: {
    edit: (task, renderCallback) => openTaskForm({
      action: FORM_CONSTANTS.ACTIONS.EDIT_TASK,
      task: task,
      formSubmitCallback: (editedTask) => {
        editedTask.id = task.id
        editedTask.status = task.status

        taskStorage.update(editedTask)
        renderCallback(editedTask)
      },
    }),
    done: (task, renderCallback) => {
      openTaskActionsForm({
        action: FORM_CONSTANTS.ACTIONS.DONE_TASK,
        formSubmitCallback: taskName => {
          if (taskName !== task.name) {
            throw new Error()
          }

          taskStorage.update(task)
          renderCallback()
        },
      })
    },
    remove: (task, renderCallback) => {
      openTaskActionsForm({
        action: FORM_CONSTANTS.ACTIONS.REMOVE_TASK,
        formSubmitCallback: taskName => {
          if (taskName !== task.name) {
            throw new Error()
          }

          taskStorage.update(task)
          renderCallback()
        },
      })
    }
  },
})
let renderNextPage = tasksRender.renderPage(taskStorage.getAll())

taskFormInit({
  addCallback: task => {
    taskStorage.add(task)
    tasksRender.addTask(task)
  },
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