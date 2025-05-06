import {createPages} from "../../utils/pagination.js";
import {TASK_STATUS} from "../../utils/constants.js";

export function taskRenderInit(options) {
  const _taskContainer = options.taskContainer
  const _callbacks = options.callbacks

  document.addEventListener("click", () => {
    _taskContainer.querySelector(".open")
      ?.classList.remove("open")
  })

  const _pages = createPages(10)

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
    (task.description ? " has-description" : ""))
  const leftColumn = createDivElement("task__left-column")
  leftColumn.append(name, descriptionIcon)

  const status = createDivElement("task__status", {textContent: task.status})
  const openActionsButton = createDivElement("task__open-actions-btn",
    {
      clickHandler: event => {
        event.stopPropagation()

        if (actionsWrapper.classList.contains("open")) {
          actionsWrapper.classList.remove("open")
        } else {
          const anotherOpenedActions = taskContainer.querySelector(".open")
          if (anotherOpenedActions) {
            anotherOpenedActions.classList.remove("open")
          }

          actionsWrapper.classList.add("open")
          if (taskContainer.parentNode.clientHeight < actionsWrapper.getBoundingClientRect().bottom) {
            actionsWrapper.style.top = "-" + actionsWrapper.clientHeight + "px"
          }
        }
      }
    })
  const doneButton = createDivElement("task__done button click-animation",
    {
      textContent: "Done",
      once: true,
      clickHandler: () => {
        if (task.status === TASK_STATUS.DONE) return

        actionsWrapper.classList.remove("open")

        task.status = TASK_STATUS.DONE
        callbacks.done(
          task,
          () => {
            taskElement.classList.add("done")
          }
        )
      }
    })
  const removeButton = createDivElement("task__remove button click-animation",
    {
      textContent: "Delete",
      clickHandler: () => {
        callbacks.remove(
          task,
          () => {
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

  const rightColumn = createDivElement("task__right-column")
  rightColumn.append(status, openActionsButton, actionsWrapper)

  const contentWrapper = createDivElement("task__content-wrapper")
  contentWrapper.append(leftColumn, rightColumn)

  const taskElement = createDivElement(
    "task" + (task.status === TASK_STATUS.DONE ? " done" : ""),
    {
      clickHandler: () => {
        callbacks.edit(
          task,
          task => {
            name.textContent = task.name
            descriptionIcon.classList.toggle("has-description", task.description.trim())
          })
      }
    }
  )
  taskElement.appendChild(contentWrapper)

  return taskElement
}

function createDivElement(className, options = null) {
  const element = document.createElement("div")
  element.className = className

  if (options) {
    if (options.textContent) {
      element.textContent = options.textContent
    }

    if (options.clickHandler) {
      element.addEventListener("click", options.clickHandler, {once: options.once})
    }
  }

  return element
}