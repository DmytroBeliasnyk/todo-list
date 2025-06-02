const mockTaskStorageInit = vi.fn(() => {
  return {
    getAll: vi.fn(),
  }
})
const mockTaskRenderInit = vi.fn(() => {
  return {
    renderPage: vi.fn(() => function () {
    }),
  }
})
const mockOpenTaskForm = vi.fn()
const mockOpenTaskActionsForm = vi.fn()
const mockFiltersHandlersInit = vi.fn()

beforeAll(() => {
  vi.mock("./services/entities/task-storage.js", () => ({
    taskStorageInit: mockTaskStorageInit,
  }))
  vi.mock("./components/tasks/render.js", () => ({
    taskRenderInit: mockTaskRenderInit,
  }))
  vi.mock("./components/tasks/forms/actions-task.js", () => ({
    openTaskActionsForm: mockOpenTaskActionsForm,
  }))
  vi.mock("./components/tasks/forms/add-task.js", () => ({
    openTaskForm: mockOpenTaskForm,
  }))
  vi.mock("./components/tasks/filters.js", () => ({
    filtersHandlersInit: mockFiltersHandlersInit,
  }))
})

it("init app", async () => {
  const initializationActions = {
    renderNextPage: undefined,
    openTaskForm: undefined,
  }
  const {initApp} = await import("./init-app.js")
  const mockInitApp = vi.fn(() => {
    initApp(initializationActions)
  })

  mockInitApp()

  expect(mockInitApp).toHaveReturned()
  expect(typeof initializationActions.renderNextPage).toBe("function")
  expect(initializationActions.openTaskForm).toEqual(mockOpenTaskForm)
  expect(mockTaskStorageInit).toHaveBeenCalled()
  expect(mockTaskRenderInit).toHaveBeenCalled()
  expect(mockFiltersHandlersInit).toHaveBeenCalled()
})
