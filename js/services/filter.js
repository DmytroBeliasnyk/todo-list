export const filterService = (() => {
  const _filterImplementation = new Map([
    ["search", (tasks, searchValue) => tasks.filter(
      task => task.name.toLowerCase().includes(searchValue.toLowerCase())
    )],
    ["filter-in-progress", (tasks) => tasks.filter(
      task => task.status === "In progress"
    )],
    ["filter-done", (tasks) => tasks.filter(
      task => task.status === "Done",
    )],
    ["filter-description", (tasks) => tasks.filter(
      task => task.description
    )],
  ])
  const _applyFilters = (tasks, filterId) => {
    for (const [filter, filterValue] of _enabledFilters.entries()) {
      if (filter === filterId) continue
      tasks = _filterImplementation.get(filter)(tasks, filterValue)
    }

    return tasks
  }
  const _enabledFilters = new Map()

  return {
    search(tasks, targetFilter) {
      const searchValue = targetFilter.value.trim()
      const filterId = targetFilter.id

      if (_enabledFilters.size) tasks = _applyFilters(tasks, filterId)

      if (!searchValue) {
        _enabledFilters.delete(filterId)
      } else {
        _enabledFilters.set(filterId, searchValue)
        tasks = _filterImplementation.get(filterId)(tasks, searchValue)
      }

      return tasks
    },
    filter(tasks, targetFilter) {
      const filterId = targetFilter.id

      if (targetFilter.classList.contains("enabled")) {
        targetFilter.classList.remove("enabled")
        _enabledFilters.delete(filterId)
      } else {
        for (const enabledFilter of document.querySelectorAll(".enabled")) {
          if (!enabledFilter.dataset.enabledTogether && !targetFilter.dataset.enabledTogether) {
            enabledFilter.classList.remove("enabled")
            _enabledFilters.delete(enabledFilter.id)
          }
        }

        targetFilter.classList.add("enabled")
        _enabledFilters.set(filterId, undefined)

        tasks = _filterImplementation.get(filterId)(tasks)
      }

      if (_enabledFilters.size) tasks = _applyFilters(tasks, filterId)

      return tasks
    },
  }
})
()