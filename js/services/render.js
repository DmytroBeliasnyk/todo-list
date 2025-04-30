import {createPages} from "../utils/pagination.js";

export default (options) => {
  const _taskContainer = options.taskContainer
  const _callbacks = options.callbacks

  const _pages = createPages(10)
  let _pagesGenerator = null

  let _tasks = []

  return {
    addTask(task) {
      _taskContainer.prepend(createTaskElement(task, _taskContainer, _callbacks))
    },
    renderPage(tasks) {
      _tasks = tasks
      _pages.setNewPages(0, tasks.length)
      _pagesGenerator = _pages.pageGenerator()

      _taskContainer.innerHTML = ""
      this.renderNextPage()
    },
    renderNextPage() {
      const nextPage = _pagesGenerator.next()
      if (nextPage.done) return

      _taskContainer.append(...
        _tasks
          .slice(nextPage.value.start, nextPage.value.end)
          .map(task => createTaskElement(task, _taskContainer, _callbacks))
      )
    },
  }
}

function createTaskElement(task, taskContainer, callbacks) {
  const taskContentWrapper = document.createElement("div")
  taskContentWrapper.className = "task__content-wrapper"

  const taskLeftColumn = document.createElement("div")
  taskLeftColumn.className = "task__left-column"

  const taskName = document.createElement("div")
  taskName.className = "task__name"
  taskName.textContent = task.name

  const taskShowMenuButton = document.createElement("div")
  taskShowMenuButton.className = "task__show-menu-btn"

  taskLeftColumn.append(taskName, taskShowMenuButton)

  const taskRightColumn = document.createElement("div")
  taskRightColumn.className = "task__right-column"

  const taskStatus = document.createElement("div")
  taskStatus.className = "task__status"
  taskStatus.textContent = task.status

  taskRightColumn.appendChild(taskStatus)

  taskContentWrapper.append(taskLeftColumn, taskRightColumn)

  const taskMenuWrapper = document.createElement("div")
  taskMenuWrapper.className = "task__menu-wrapper"

  const taskDescription = document.createElement("div")
  taskDescription.className = "task__description scrolling"
  if (task.description) {
    taskDescription.classList.add("has-description")
  }

  const descriptionWrapper = document.createElement("div")
  descriptionWrapper.className = "description-wrapper"
  taskDescription.textContent = task.description

  taskDescription.appendChild(descriptionWrapper)

  taskMenuWrapper.appendChild(taskDescription)

  const taskButtons = document.createElement("div")
  taskButtons.className = "task__buttons"

  const taskEditButton = document.createElement("div")
  taskEditButton.className = "task__open-form-edit-task button click-animation"
  taskEditButton.textContent = "Edit task"

  const taskDoneButton = document.createElement("div")
  taskDoneButton.className = "task__done button click-animation"
  taskDoneButton.textContent = "Done"

  const taskRemoveButton = document.createElement("div")
  taskRemoveButton.className = "task__remove button click-animation"
  taskRemoveButton.textContent = "Delete"

  const taskActionsWrapper = document.createElement("div")
  taskActionsWrapper.className = "task__actions-wrapper"

  taskActionsWrapper.append(taskDoneButton, taskRemoveButton)

  const taskOpenActionsButton = document.createElement("div")
  taskOpenActionsButton.className = "task__open-actions-btn"
  taskOpenActionsButton.addEventListener("click", () => {
    taskActionsWrapper.classList.toggle("show-actions")
  })

  taskButtons.append(taskEditButton, taskOpenActionsButton, taskActionsWrapper)

  taskMenuWrapper.appendChild(taskButtons)

  const taskElement = document.createElement("div")
  taskElement.className = "task"
  if (task.status === "Done") {
    taskElement.classList.add("done")
  } else {
    taskDoneButton.addEventListener("click", () => {
      task.status = "Done"
      callbacks.done(
        task,
        () => {
          taskActionsWrapper.classList.remove("show")

          taskElement.classList.add("done")
          taskStatus.textContent = "Done"
        }
      )
    }, {once: true})
  }

  taskElement.append(taskContentWrapper, taskMenuWrapper)

  taskShowMenuButton.addEventListener("click", () => {
    const isOpen = taskShowMenuButton.classList.contains("show-menu")

    if (!isOpen) {
      const anotherMenu = taskContainer.querySelector(".open")
      if (anotherMenu) {
        taskContainer.querySelector(".show-menu").classList.remove("show-menu")
        anotherMenu.classList.remove("open")
      }
    }

    taskMenuWrapper.classList.toggle("open")
    if (task.description) {
      taskMenuWrapper.classList.add("has-description")
    }

    taskShowMenuButton.classList.toggle("show-menu")

    taskActionsWrapper.classList.remove("show-actions")
  })
  taskEditButton.addEventListener("click", () => {
    callbacks.edit(
      task,
      task => {
        taskName.textContent = task.name

        const description = task.description.trim()
        if (description) {
          descriptionWrapper.textContent = description
          taskMenuWrapper.classList.add("has-description")
          taskDescription.classList.add("has-description")
        } else {
          setTimeout(() => {
            descriptionWrapper.textContent = description
          }, 350)
          taskMenuWrapper.classList.remove("has-description")
          taskDescription.classList.remove("has-description")
        }
      })
  })
  taskRemoveButton.addEventListener("click", () => {
    callbacks.remove(
      task,
      () => taskElement.remove()
    )
  })

  return taskElement
}