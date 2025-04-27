export const filters = new Map([
  ["search", (tasks, searchValue) => {
    if (!searchValue) return tasks

    return tasks.filter(
      task => task.name.toLowerCase().includes(searchValue.toLowerCase())
    )
  }],
  ["filter-in-progress", tasks => tasks.filter(
    task => task.status === "In progress"
  )],
  ["filter-done", tasks => tasks.filter(
    task => task.status === "Done",
  )],
])