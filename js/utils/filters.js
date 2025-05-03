import {constants} from "../constants.js";

export const filters = new Map([
  [constants.filters.ids.searchInput, (tasks, searchValue) => {
    if (!searchValue) return tasks

    return tasks.filter(
      task => task.name.toLowerCase().includes(searchValue.toLowerCase())
    )
  }],
  [constants.filters.ids.inProgress, tasks => tasks.filter(
    task => task.status === constants.tasks.status.inProgress
  )],
  [constants.filters.ids.done, tasks => tasks.filter(
    task => task.status === constants.tasks.status.done,
  )],
])