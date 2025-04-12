export default (taskContainer) => {
  const _createTaskElement = (task) => {
    const taskElement = document.createElement("div")
    taskElement.className = "task"

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

    const icon = document.createElement("div")
    icon.className = "fa-solid fa-pen-to-square"

    editButton.appendChild(icon)

    taskElement.append(wrapper, editButton)

    return taskElement
  }

  return {
    renderNewTask(task) {
      taskContainer.prepend(_createTaskElement(task))
    },
    renderAll(tasks) {
      tasks = tasks.map(task => _createTaskElement(task))
      taskContainer.replaceChildren(...tasks)
    },
  }
}