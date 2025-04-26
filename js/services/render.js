export default (options) => {
  const _taskContainer = options.taskContainer
  const _callbacks = options.callbacks

  const _tasksOnPage = 10
  let _tasks = []
  let _pageCount = 0
  let _currentPage = 0

  return {
    addTask(task) {
      _taskContainer.prepend(createTaskElement(task, _callbacks))
    },
    renderPage(tasks) {
      _tasks = tasks
      _pageCount = Math.ceil(tasks.length / 10)
      _currentPage = 0

      const start = _currentPage * _tasksOnPage
      const end = start + _tasksOnPage

      _taskContainer.replaceChildren(...
        _tasks
          .slice(start, end)
          .map(task => createTaskElement(task, _callbacks))
      )

      console.log(`render end, page: ${_currentPage}`)
    },
    renderNextPage() {
      _currentPage++
      if (_currentPage > _pageCount) return

      const start = _currentPage * _tasksOnPage
      const end = start + _tasksOnPage

      _taskContainer.append(...
        _tasks
          .slice(start, end)
          .map(task => createTaskElement(task, _callbacks))
      )

      console.log(`render end, page: ${_currentPage}`)
    },
  }
}

function createTaskElement(task, callbacks) {
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

  const taskDescription = document.createElement("textarea")
  taskDescription.className = "task__description scrolling"
  taskDescription.textContent = task.description

  taskMenuWrapper.appendChild(taskDescription)

  const taskButtons = document.createElement("div")
  taskButtons.className = "task__buttons"

  const taskDoneButton = document.createElement("div")
  taskDoneButton.className = "task__done button click-animation"
  taskDoneButton.textContent = "Done"

  const taskRemoveButton = document.createElement("div")
  taskRemoveButton.className = "task__remove button click-animation"
  taskRemoveButton.textContent = "Delete"

  taskButtons.append(taskDoneButton, taskRemoveButton)

  taskMenuWrapper.appendChild(taskButtons)

  const taskElement = document.createElement("div")
  taskElement.className = "task"
  if (task.status === "Done") {
    taskElement.classList.add("done")
    taskDoneButton.disabled = true
  }

  taskElement.append(taskContentWrapper, taskMenuWrapper)

  taskShowMenuButton.addEventListener("click", () => {
    const isOpen = taskShowMenuButton.classList.contains("show")

    if (!isOpen) {
      const anotherMenu = document.querySelector(".open")
      if (anotherMenu) {
        document.querySelector(".show").classList.remove("show")
        anotherMenu.classList.remove("open")

        anotherMenu.style.height = "0px"
      }
    }

    taskMenuWrapper.style.height = (isOpen ? 0 : taskMenuWrapper.scrollHeight) + "px"

    taskMenuWrapper.classList.toggle("open")
    taskShowMenuButton.classList.toggle("show")
  })
  taskDescription.addEventListener("change", () => {
    task.description = taskDescription.value
    callbacks.edit(task)
  })
  taskDoneButton.addEventListener("click", () => {
    taskElement.classList.add("done")
    taskStatus.textContent = "Done"

    task.status = "Done"
    callbacks.done(task)
  })
  taskRemoveButton.addEventListener("click", () => {
    taskElement.remove()
    callbacks.remove(task)
  })

  return taskElement
}