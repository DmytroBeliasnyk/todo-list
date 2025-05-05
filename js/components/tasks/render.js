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
  const name = createDivElement("task__name", {textContent: task.name})
  const showMenuButton = createDivElement("task__show-menu-btn")
  leftColumn.append(name, showMenuButton)

  const rightColumn = createDivElement("task__right-column")
  const status = createDivElement("task__status", {textContent: task.status})
  rightColumn.appendChild(status)

  const contentWrapper = createDivElement("task__content-wrapper")
  contentWrapper.append(leftColumn, rightColumn)

  const description = createDivElement("task__description scrolling"
    + (task.description ? " has-description" : ""))
  const descriptionWrapper = createDivElement("description-wrapper",
    {textContent: task.description ?? ""})
  description.appendChild(descriptionWrapper)

  const doneButton = createDivElement("task__done button click-animation",
    {
      textContent: "Done",
      once: true,
      eventHandler: () => {
        if (task.status === tasksStatuses.done) return

        task.status = tasksStatuses.done
        callbacks.done(
          task,
          () => {
            actionsWrapper.classList.remove("show-actions")

            taskElement.classList.add("done")
            status.textContent = "Done"
          }
        )
      }
    })
  const removeButton = createDivElement("task__remove button click-animation",
    {textContent: "Delete"})
  const actionsWrapper = createDivElement("task__actions-wrapper")
  actionsWrapper.append(doneButton, removeButton)

  const buttons = createDivElement("task__buttons")
  const editButton = createDivElement("task__open-form-edit-task button click-animation",
    {textContent: "Edit task"})
  const openActionsButton = createDivElement("task__open-actions-btn",
    {
      eventHandler: () => {
        actionsWrapper.classList.toggle("show-actions")
      }
    }
  )
  buttons.append(editButton, openActionsButton, actionsWrapper)

  const menuWrapper = createDivElement("task__menu-wrapper")
  menuWrapper.append(description, buttons)

  const taskElement = createDivElement(
    "task" + (task.status === tasksStatuses.done ? " done" : ""))
  taskElement.append(contentWrapper, menuWrapper)

  showMenuButton.addEventListener("click", () => {
    const isOpen = showMenuButton.classList.contains("show-menu")

    if (!isOpen) {
      const anotherMenu = taskContainer.querySelector(".open")
      if (anotherMenu) {
        taskContainer.querySelector(".show-menu").classList.remove("show-menu")
        anotherMenu.classList.remove("open")
      }
    }

    menuWrapper.classList.toggle("open")
    if (task.description) {
      menuWrapper.classList.add("has-description")
    }

    showMenuButton.classList.toggle("show-menu")

    actionsWrapper.classList.remove("show-actions")
  })
  editButton.addEventListener("click", () => {
    callbacks.edit(
      task,
      task => {
        name.textContent = task.name

        const taskDescription = task.description.trim()
        if (taskDescription) {
          descriptionWrapper.textContent = taskDescription
          menuWrapper.classList.add("has-description")
          description.classList.add("has-description")
        } else {
          setTimeout(() => {
            descriptionWrapper.textContent = taskDescription
          }, 350)
          menuWrapper.classList.remove("has-description")
          description.classList.remove("has-description")
        }
      })
  })
  removeButton.addEventListener("click", () => {
    callbacks.remove(
      task,
      () => taskElement.remove()
    )
  })

  return taskElement
}

function createDivElement(className, options = null) {
  const element = document.createElement("div")
  element.className = className

  if (options) {
    if (options.textContent) {
      element.textContent = options.textContent
    }

    if (options.eventHandler && typeof options.eventHandler === "function") {
      element.addEventListener("click", () => {
        options.eventHandler()
      }, {once: options.once})
    }
  }

  return element
}