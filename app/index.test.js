/**
 * @jest-environment jsdom
 */
import {jest} from "@jest/globals"

class IntersectionObserver {
  observe() {
    return null;
  }
}

window.IntersectionObserver = IntersectionObserver;
global.IntersectionObserver = IntersectionObserver;

const mockRenderNextPage = jest.fn()
const mockOpenTaskForm = jest.fn()
const mockTaskRenderRenderPage = jest.fn()

const mockInitApp = jest.fn(actions => {
  actions.renderNextPage = mockRenderNextPage
  actions.openTaskForm = mockOpenTaskForm

  return {
    taskStorage: {getAll: jest.fn()},
    taskRender: {renderPage: mockTaskRenderRenderPage},
  }
})
jest.unstable_mockModule("./js/init.js", () => ({
  initApp: mockInitApp,
}))

document.body.innerHTML = `<div class="open-task-form-add-task"></div> `

test("run index", async () => {
  await import("./index.js")

  expect(mockInitApp).toHaveReturned()
})

test("open task form", async () => {
  await import("./index.js")

  document.querySelector(".open-task-form-add-task").click()

  expect(mockOpenTaskForm).toHaveBeenCalled()
})

test("storage event", async () => {
  await import("./index.js")

  window.dispatchEvent(new StorageEvent("storage"))

  expect(mockTaskRenderRenderPage).toHaveBeenCalled()
})