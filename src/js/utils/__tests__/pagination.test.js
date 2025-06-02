import {createPages} from "../pagination.js";

it.each([
  ["array length > 0", [0, 0, 0, 0, 0, 0, 0, 0, 0]],
  ["array length == 0", []]
])
("%s", (_, elements) => {
  const countOnPage = 3
  const pages = createPages(countOnPage)
  const pageGenerator = pages.new(elements)()

  let callCount = 0
  let nextPage = pageGenerator.next()
  while (!nextPage.done) {
    callCount++
    nextPage = pageGenerator.next()
  }

  expect(callCount).toBe(Math.ceil(elements.length / countOnPage))
})