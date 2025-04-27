export const filterService = (() => {
  const _enabledFilters = new Map()

  return {
    setFilter(filterId, filterCallback) {
      _enabledFilters.set(filterId, filterCallback)
    },
    removeFilter(filterId) {
      _enabledFilters.delete(filterId)
    },
    applyFilters(tasks) {
      for (const filterCallback of _enabledFilters.values()) {
        tasks = filterCallback(tasks)
      }

      return tasks
    },
  }
})()