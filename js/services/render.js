export default (taskContainer, tasksLoader) => {
  const _addShowMenuListener = (showMenuButton, menu) => {
    showMenuButton.addEventListener("click", event => {
      const isOpen = showMenuButton.classList.toggle("show")

      let menuScrollHeight = menu.scrollHeight
      if (!isOpen) {
        menuScrollHeight = 0
      }

      menu.style.height = menuScrollHeight + "px"
    })
  }
  const _addCustomEventListener = (element, eventType, eventName, detail) => {
    element.addEventListener(eventType, () => {
      element.dispatchEvent(new CustomEvent(eventName, {
        bubbles: true,
        detail: detail
      }))
    })
  }
  const _createTaskElement = (task) => {
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

    const detail = {
      task: task,
      taskElement: taskElement
    }
    _addShowMenuListener(taskShowMenuButton, taskMenuWrapper)
    _addCustomEventListener(taskDescription, "change", "update-description", detail)
    _addCustomEventListener(taskDoneButton, "click", "done-task", detail)
    _addCustomEventListener(taskRemoveButton, "click", "remove-task", detail)

    return taskElement
  }

  const _tasksOnPage = 10
  let _tasks = []
  let _pageCount = 0
  let _currentPage = 0

  return {
    renderTask(task) {
      taskContainer.prepend(_createTaskElement(task))
    },
    renderPage(tasks = null, replace = false) {
      if (tasks) {
        _tasks = tasks
        _pageCount = Math.ceil(tasks.length / 10)
        _currentPage = 0
      }
      if (_currentPage > _pageCount) return

      const start = _currentPage * _tasksOnPage
      const end = start + _tasksOnPage
      _currentPage++

      if (replace) {
        console.log("replace tasks")
        taskContainer.innerHTML = ''
        taskContainer.appendChild(tasksLoader)
      }

      _tasks
        .slice(start, end)
        .map(task => _createTaskElement(task))
        .forEach(taskElement => tasksLoader.insertAdjacentElement("beforebegin", taskElement))

      console.log(`render end, page: ${_currentPage - 1}`)
      if (taskContainer.clientHeight + taskContainer.scrollTop >= taskContainer.scrollHeight) {
        this.renderPage()
      }
    },
    updateTaskStatus(taskElement) {
      taskElement.classList.add("done")
      taskElement.querySelector(".task__status").textContent = "Done"
      taskElement.querySelector(".task__done").disabled = true
    },
    removeTask(taskElement) {
      taskElement.remove()
    },
  }
}