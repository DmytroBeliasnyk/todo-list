import {taskStorageInit} from "./services/entities/task-storage.js";
import {taskRenderInit} from "./components/tasks/render.js";
import {openTaskForm} from "./components/tasks/forms/add-task.js";
import {openTaskActionsForm} from "./components/tasks/forms/actions-task.js";
import {filtersHandlersInit} from "./components/tasks/filters.js";
import {FORM_ACTIONS, TASK_STATUS} from "./utils/constants.js";

const taskStorage = taskStorageInit()
const tasksRender = taskRenderInit({
  taskContainer: document.querySelector(".tasks__container"),
  callbacks: {
    edit: (task, renderCallback) => openTaskForm({
      action: FORM_ACTIONS.EDIT_TASK,
      task: task,
      formSubmitCallback: (editedTask) => {
        editedTask.id = task.id
        editedTask.status = task.status

        try {
          taskStorage.update(editedTask)
          renderCallback(editedTask)
        } catch (error) {
          console.error(error)
        }
      },
    }),
    done: (task, renderCallback) => {
      openTaskActionsForm({
        action: FORM_ACTIONS.DONE_TASK,
        formSubmitCallback: taskName => {
          if (taskName !== task.name) {
            throw new Error()
          }

          try {
            task.status = TASK_STATUS.DONE
            taskStorage.update(task)
            renderCallback()
          } catch (error) {
            console.error(error)
          }
        },
      })
    },
    remove: (task, renderCallback) => {
      openTaskActionsForm({
        action: FORM_ACTIONS.REMOVE_TASK,
        formSubmitCallback: taskName => {
          if (taskName !== task.name) {
            throw new Error()
          }

          try {
            taskStorage.remove(task)
            renderCallback()
          } catch (error) {
            console.error(error)
          }
        },
      })
    }
  },
})
let renderNextPage = tasksRender.renderPage(taskStorage.getAll())

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

try{
  filtersHandlersInit(
    taskStorage.getAll,
    tasks => {
      renderNextPage = tasksRender.renderPage(tasks)
    }
  )
}catch (error){
  console.error(error)
}

document.querySelector(".open-task-form-add-task")
  .addEventListener("click", () => {
    openTaskForm({
      action: FORM_ACTIONS.ADD_TASK,
      formSubmitCallback: (task) => {
        task.id = crypto.randomUUID()

        try {
          taskStorage.add(task)
          tasksRender.addTask(task)
        } catch (error) {
          console.error(error)
        }
      },
    })
  })

window.addEventListener("storage", () => {
  renderNextPage = tasksRender.renderPage(taskStorage.getAll())
})