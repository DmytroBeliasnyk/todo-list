export const formValidator = (() => {
  const taskNamesSet = new Set()

  return {
    validateTaskName(taskName) {
      const res = {
        hasError: false,
        errorMessage: '',
      }

      if (!taskName.trim()) {
        res.hasError = true
        res.errorMessage = "Field \"name\" can't be empty."

        return res
      }

      if (taskNamesSet.has(taskName)) {
        res.hasError = true
        res.errorMessage = "Task name must be unique"
      } else {
        taskNamesSet.add(taskName)
      }

      return res
    },
  }
})()