class IntersectionObserver {
  observe() {
    return null;
  }
}

window.IntersectionObserver = IntersectionObserver;
global.IntersectionObserver = IntersectionObserver;

const mockRenderNextPage = vi.fn()
const mockOpenTaskForm = vi.fn()
const mockTaskRenderRenderPage = vi.fn()

const mockInitApp = vi.fn(actions => {
  actions.renderNextPage = mockRenderNextPage
  actions.openTaskForm = mockOpenTaskForm

  return {
    taskStorage: {getAll: vi.fn()},
    taskRender: {renderPage: mockTaskRenderRenderPage},
  }
})
vi.mock("./js/init-app.js", () => ({
  initApp: mockInitApp,
}))

document.body.innerHTML = `<div class="open-task-form-add-task"></div> `

test("run index", async () => {
  await import("./index.js")

  expect(mockInitApp).toHaveReturned()
})

it("open task form", async () => {
  await import("./index.js")

  document.querySelector(".open-task-form-add-task").click()

  expect(mockOpenTaskForm).toHaveBeenCalled()
})

it("storage event", async () => {
  await import("./index.js")

  window.dispatchEvent(new StorageEvent("storage"))

  expect(mockTaskRenderRenderPage).toHaveBeenCalled()
})