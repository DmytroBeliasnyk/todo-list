export function createPages(countOnPage) {
  let _current = 0
  let _count = 0

  return {
    * nextPage() {
      while (_current <= _count) {
        const start = _current * countOnPage
        const end = start + countOnPage

        _current++
        yield {start, end}
      }
    },
    newPages(elementsCount) {
      _current = 0
      _count = Math.ceil(elementsCount / countOnPage)
    },
  }
}