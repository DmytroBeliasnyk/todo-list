/**
 * @jest-environment jsdom
 */
import {jest} from "@jest/globals"

const mockTaskStorageInit = jest.fn(() => {
  return {
    getAll: jest.fn(),
  }
})
const mockTaskRenderInit = jest.fn(() => {
  return {
    renderPage: jest.fn(() => function () {
    }),
  }
})
const mockOpenTaskForm = jest.fn()
const mockOpenTaskActionsForm = jest.fn()
const mockFiltersHandlersInit = jest.fn()

beforeAll(() => {
  jest.unstable_mockModule("./services/entities/task-storage.js", () => ({
    taskStorageInit: mockTaskStorageInit,
  }))
  jest.unstable_mockModule("./components/tasks/render.js", () => ({
    taskRenderInit: mockTaskRenderInit,
  }))
  jest.unstable_mockModule("./components/tasks/forms/actions-task.js", () => ({
    openTaskActionsForm: mockOpenTaskActionsForm,
  }))
  jest.unstable_mockModule("./components/tasks/forms/add-task.js", () => ({
    openTaskForm: mockOpenTaskForm,
  }))
  jest.unstable_mockModule("./components/tasks/filters.js", () => ({
    filtersHandlersInit: mockFiltersHandlersInit,
  }))
})

test("init app", async () => {
  const expectedInitialization = {
    renderNextPage: null,
    openTaskForm: null,
  }
  const {initApp} = await import("./init.js")
  const mockInitApp = jest.fn(() => initApp(expectedInitialization))

  mockInitApp()

  expect(mockInitApp).toHaveReturned()
  expect(typeof expectedInitialization.renderNextPage === "function").toBeTruthy()
  expect(expectedInitialization.openTaskForm).toEqual(mockOpenTaskForm)
  expect(mockTaskStorageInit).toHaveBeenCalled()
  expect(mockTaskRenderInit).toHaveBeenCalled()
  expect(mockFiltersHandlersInit).toHaveBeenCalled()
})
