export const navigationManager = {
  taskContainer: document.querySelector(".content__tasks"),
  searchInput: document.querySelector(".content__search"),
  searchEngine() {
    const foundTasks = this.taskService.getAllTasks()
      .filter(task => task.name.startsWith(this.searchInput.value))
      .map(task => this.taskService.toHtmlElement(task))

    this.taskContainer.replaceChildren(...foundTasks)
  },
}