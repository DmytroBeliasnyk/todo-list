export function createPages(countOnPage) {
  let _current = 0
  let _count = 0

  return {
    new(elements) {
      _current = 0
      _count = Math.ceil(elements.length / countOnPage)

      return function* () {
        while (_current <= _count) {
          const start = _current * countOnPage
          const end = start + countOnPage

          _current++
          yield elements.slice(start, end)
        }
      }
    },
  }
}