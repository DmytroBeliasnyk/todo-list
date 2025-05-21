import {taskStorageInit} from "./services/entities/task-storage.js";
import {taskRenderInit} from "./components/tasks/render.js";
import {openTaskForm} from "./components/tasks/forms/add-task.js";
import {FORM_ACTIONS, TASK_STATUS} from "./utils/constants.js";
import {openTaskActionsForm} from "./components/tasks/forms/actions-task.js";
import {filtersHandlersInit} from "./components/tasks/filters.js";

export function initApp(render) {
  const taskStorage = taskStorageInit()
  const taskRender = taskRenderInit({
    taskContainer: document.querySelector(".tasks__container"),
    countOnPage: 10,
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
  render.nextPage = taskRender.renderPage(taskStorage.getAll())

  try {
    filtersHandlersInit(
      taskStorage.getAll,
      tasks => {
        render.nextPage = taskRender.renderPage(tasks)
      }
    )
  } catch (error) {
    console.error(error)
  }

  return {
    taskStorage: taskStorage,
    taskRender: taskRender,
  }
}