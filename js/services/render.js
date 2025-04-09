export function renderTask(task) {
  const taskElement = document.createElement("div")
  taskElement.className = "task"
  taskElement.innerHTML = `
      <div class="task__content-wrapper">
        <div class="task__left-content">
          <div class="task__name">${task.name}</div>
          <div class="task__description">${task.description}</div>
        </div>
        <div class="task__right-content">
          <div class="task__status">In progress</div>
        </div>
      </div>
      <div class="task__edit button">
        <div class="fa-solid fa-pen-to-square"></div>
      </div>
    </div>
  `

  return taskElement
}