import {createPages} from "../../utils/pagination.js";
import {tasksStatuses} from "../../utils/constants.js";

export function taskRenderInit(options) {
  const _taskContainer = options.taskContainer
  const _callbacks = options.callbacks

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
  const leftColumn = createDivElement("task__left-column")
  const name = createDivElement("task__name", task.name)
  const descriptionIcon = createDivElement("task__description-icon" +
    (task.description ? " has-description" : ""))
  leftColumn.append(name, descriptionIcon)

  const rightColumn = createDivElement("task__right-column")
  const status = createDivElement("task__status", task.status)
  rightColumn.appendChild(status)

  const contentWrapper = createDivElement("task__content-wrapper")
  contentWrapper.append(leftColumn, rightColumn)

  const taskElement = createDivElement(
    "task" + (task.status === tasksStatuses.done ? " done" : ""))
  taskElement.appendChild(contentWrapper)

  taskElement.addEventListener("click", () => {
    callbacks.edit(
      task,
      task => {
        name.textContent = task.name
        descriptionIcon.classList.toggle("has-description", task.description.trim())
      })
  })

  return taskElement
}

function createDivElement(className, textContent = null) {
  const element = document.createElement("div")
  element.className = className

  if (textContent) {
    element.textContent = textContent
  }

  return element
}