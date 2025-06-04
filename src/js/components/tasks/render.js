import '#/task.scss'
import {createPages} from "@/utils/pagination.js";
import {TASK_STATUS, TOOLTIPS} from "@/utils/constants.js";

export function taskRenderInit(options) {
  const _taskContainer = options.taskContainer
  const _callbacks = options.callbacks

  document.addEventListener("click", event => {
    _taskContainer.querySelectorAll(".open")
      .forEach(element => {
        element.classList.remove("open")
      })
  })

  const _countOnPage = options.countOnPage
  const _pages = createPages(_countOnPage)

  return {
    addTask(task) {
      _taskContainer.prepend(createTaskElement(task, _taskContainer, _callbacks))
    },
    renderPage(tasks) {
      const pageGenerator = _pages.new(tasks)()

      _taskContainer.innerHTML = ""

      function renderNext() {
        const nextPage = pageGenerator.next()
        if (nextPage.done) return

        _taskContainer.append(...
          nextPage.value.map(task => createTaskElement(task, _taskContainer, _callbacks))
        )
      }

      renderNext()

      return renderNext
    },
  }
}

function createTaskElement(task, taskContainer, callbacks) {
  const name = createDivElement("task__name", {textContent: task.name})
  const descriptionIcon = createDivElement("task__description-icon" +
    (task.description ? " has-description" : ""), {tooltip: TOOLTIPS.HAS_DESCRIPTION})
  const leftColumn = createDivElement("task__left-column")
  leftColumn.append(name, descriptionIcon)

  const status = createDivElement("task__status", {textContent: task.status})
  const openActionsButton = createDivElement("task__open-actions-btn",
    {
      tooltip: TOOLTIPS.TASK_ACTIONS,
      clickHandler: event => {
        event.stopPropagation()

        if (!openActionsButton.classList.contains("open")) {
          taskContainer.querySelectorAll(".open")
            .forEach(element => {
              element.classList.remove("open")
            })
        }

        actionsWrapper.classList.toggle("open")
        openActionsButton.classList.toggle("open")
      }
    })
  const rightColumn = createDivElement("task__right-column")
  rightColumn.append(status, openActionsButton)

  const contentWrapper = createDivElement("task__content-wrapper")
  contentWrapper.append(leftColumn, rightColumn)

  const doneButton = createDivElement("task__done",
    {
      clickHandler: () => {
        if (task.status === TASK_STATUS.DONE) return

        actionsWrapper.classList.remove("open")
        openActionsButton.classList.remove("open")

        callbacks.done(
          task,
          () => {
            taskElement.classList.add("done")
            status.textContent = TASK_STATUS.DONE
          }
        )
      }
    })
  const removeButton = createDivElement("task__remove",
    {
      clickHandler: () => {
        actionsWrapper.classList.remove("open")
        openActionsButton.classList.remove("open")

        callbacks.remove(task, () => {
            taskElement.remove()
          }
        )
      }
    })
  const actionsWrapper = createDivElement("task__actions-wrapper",
    {
      clickHandler: event => {
        event.stopPropagation()
      }
    }
  )
  actionsWrapper.append(doneButton, removeButton)

  const taskElement = createDivElement(
    "task" + (task.status === TASK_STATUS.DONE ? " done" : ""),
    {
      clickHandler: () => {
        callbacks.edit(task, task => {
            name.textContent = task.name
            descriptionIcon.classList.toggle("has-description", task.description.trim())
          })
      }
    }
  )
  taskElement.append(contentWrapper, actionsWrapper)

  return taskElement
}

function createDivElement(className, options = null) {
  const element = document.createElement("div")
  element.className = className

  if (options) {
    if (options.textContent) {
      element.textContent = options.textContent
    }

    if (options.tooltip) {
      element.dataset.tooltip = options.tooltip
    }

    if (options.clickHandler) {
      element.addEventListener("click", options.clickHandler)
    }
  }

  return element
}