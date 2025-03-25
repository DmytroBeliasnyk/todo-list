export const taskManager = {
  selectTask(event) {
    const targetTask = event.target.closest(".content__task")
    if (!targetTask) return

    if (event.ctrlKey || event.metaKey) {
      targetTask.classList.toggle("selected")
      return
    }

    const selectedTasks = document.querySelectorAll(".selected")
    if (selectedTasks.length) {
      if (selectedTasks.length === 1 && selectedTasks.item(0) === targetTask) {
        targetTask.classList.remove("selected")
        return
      }

      for (const task of selectedTasks) {
        task.classList.remove("selected")
      }
    }

    targetTask.classList.add("selected")
  },
  taskToEdit(event) {
    const targetTask = event.target.closest(".content__task")
    if (!targetTask) return

    targetTask.classList.add("toedit")
  }
}