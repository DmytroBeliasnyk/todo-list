export function createPages(elementsOnPage) {
  const _elementsOnPage = elementsOnPage
  let _currentPage = 0
  let _pageCount = 0

  return {
    * pageGenerator() {
      while (_currentPage <= _pageCount) {
        const start = _currentPage * _elementsOnPage
        const end = start + _elementsOnPage

        _currentPage++
        yield {start, end}
      }
    },
    setNewPages(elementsCount) {
      _currentPage = 0
      _pageCount = Math.ceil(elementsCount / _elementsOnPage)
    },
  }
}