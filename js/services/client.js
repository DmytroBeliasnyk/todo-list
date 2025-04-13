export default (tasks) => {
  const _taskContainer = document.querySelector(".tasks")
  const _containerHeight = _taskContainer.clientHeight
  const _threshold = _containerHeight / 4
  const _taskHeight = 40
  const _tasksOnPage = Math.ceil(_containerHeight / _taskHeight)

  const pageCount = Math.ceil(tasks.length / _tasksOnPage)
  let page = 0

  return {
    getFirstPage() {
      const start = page * _tasksOnPage
      const end = start + _tasksOnPage
      page++

      return tasks.slice(start, end)
    },
    getNextPage() {
      const remainingScroll = _taskContainer.scrollHeight - _taskContainer.scrollTop - _taskContainer.clientHeight
      if (remainingScroll > _threshold || page >= pageCount) return

      const start = page * _tasksOnPage
      const end = start + _tasksOnPage
      page++

      return tasks.slice(start, end)
    },
  }
}