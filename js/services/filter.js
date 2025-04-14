export default (filters) => {
  const _filtersImplementation = new Map([
    ["filter-in-progress", (tasks) => tasks.filter(
      task => task.status === "In progress")],
    ["filter-done", (tasks) => tasks.filter(
      task => task.status === "Done")]
  ])

  return {
    switchFilter(filter) {
      const isEnabled = filter.classList.contains("enabled")

      for (const filter of filters) {
        filter.classList.remove("enabled")
      }

      filter.classList.toggle("enabled", !isEnabled)
      return isEnabled
    },
    filter(tasks, filterId) {
      return _filtersImplementation.get(filterId)(tasks)
    },
    filterByTaskName(tasks, taskName) {
      return tasks.filter(findTask => findTask.name.toLowerCase().includes(taskName.toLowerCase()))
    }
  }
}