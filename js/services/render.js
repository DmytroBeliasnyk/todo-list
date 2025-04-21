export default (taskContainer, tasksLoader) => {
  const _createTaskElement = (task) => {
    const taskElement = document.createElement("div")
    taskElement.className = "task"
    if (task.status === "Done") {
      taskElement.classList.add("done")
    }

    const leftContent = document.createElement("div")
    leftContent.className = "task__left-content"

    const name = document.createElement("div")
    name.className = "task__name"
    name.textContent = task.name

    const description = document.createElement("div")
    description.className = "task__description"
    description.textContent = task.description

    leftContent.append(name, description)

    const rightContent = document.createElement("div")
    rightContent.className = "task__right-content"

    const status = document.createElement("div")
    status.className = "task__status"
    status.textContent = task.status ?? "In progress"

    rightContent.appendChild(status)

    const wrapper = document.createElement("div")
    wrapper.className = "task__content-wrapper"
    wrapper.append(leftContent, rightContent)

    const editButton = document.createElement("div")
    editButton.className = "task__edit button"

    const editIcon = document.createElement("div")
    editIcon.className = "fa-solid fa-pen-to-square"

    editButton.appendChild(editIcon)

    const removeButton = document.createElement("div")
    removeButton.className = "task__remove"

    const removeIcon = document.createElement("div")
    removeIcon.className = "fa-solid fa-trash"

    removeButton.appendChild(removeIcon)

    taskElement.append(wrapper, editButton, removeButton)

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
    updateTask(task) {
      const tasks = Array.from(taskContainer.querySelectorAll(".task"))

      const findTask = tasks.find(findElement =>
        findElement.querySelector(".task__name").textContent === task.name)

      findTask.querySelector(".task__description").textContent = task.description
      if (task.status === "Done") {
        const taskStatus = findTask.querySelector(".task__status")

        taskStatus.textContent = task.status
        taskStatus.classList.add("done")
      }
    },
    removeTaskByName(taskName) {
      const tasks = Array.from(taskContainer.querySelectorAll(".task"))

      tasks.find(findElement =>
        findElement.querySelector(".task__name").textContent === taskName)
        .remove()
    },
  }
}