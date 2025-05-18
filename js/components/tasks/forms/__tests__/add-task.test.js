/**
 * @jest-environment jsdom
 */
import {jest} from "@jest/globals"
import {FORM_ACTIONS, FORM_MESSAGES} from "../../../../utils/constants.js"


document.body.innerHTML = `<div class="modal-container">
                            <div class="modal">
                              <form name="taskForm">
                                <label class="input-name-label">
                                  <input name="name">
                                </label>
                                <div class="form__error-message"></div>
                                <textarea name="description"></textarea>
                              </form>
                            </div>
                           </div>`

const form = document.forms.taskForm
const inputName = form.elements.name
const inputDescription = form.elements.description
const errorContainer = form.querySelector(".form__error-message")
const modal = form.closest(".modal")
const modalContainer = modal.parentNode

afterEach(() => {
  form.reset()
})

test.each([
  ["add", {action: FORM_ACTIONS.ADD_TASK}],
  ["edit", {
    action: FORM_ACTIONS.EDIT_TASK,
    task: {name: "test-task", description: "test-description"},
  }]
])
("open form to %s task", async (_, options) => {
  const {openTaskForm} = await import("../add-task.js")
  const mockOpenForm = jest.fn(() => {
    openTaskForm(options)
  })

  mockOpenForm()

  expect(mockOpenForm).toHaveReturned()
  expect(modalContainer.classList.contains("active")).toBeTruthy()
  expect(modal.classList.contains(options.action)).toBeTruthy()
  expect(inputName.value).toBe(options.task?.name ?? "")
  expect(inputDescription.value).toBe(options.task?.description ?? "")
})

describe("submit form", () => {
  test("add valid task", async () => {
    const {openTaskForm} = await import("../add-task.js")
    const options = {
      action: FORM_ACTIONS.ADD_TASK,
      formSubmitCallback: jest.fn()
    }
    const expectedTask = {
      name: "test-name",
      description: "test-description"
    }
    inputName.value = expectedTask.name
    inputDescription.value = expectedTask.description

    openTaskForm(options)
    form.submit()

    expect(options.formSubmitCallback).toHaveBeenCalledWith(expectedTask)
  })

  test("add invalid task", async () => {
    const {openTaskForm} = await import("../add-task.js")
    const options = {
      action: FORM_ACTIONS.ADD_TASK,
      formSubmitCallback: jest.fn()
    }
    inputName.value = ""

    openTaskForm(options)
    form.submit()

    expect(options.formSubmitCallback).not.toHaveBeenCalled()
    expect(errorContainer.textContent).toBe(FORM_MESSAGES.EMPTY_NAME)
  })

  test("edit valid task", async () => {
    const {openTaskForm} = await import("../add-task.js")
    const options = {
      action: FORM_ACTIONS.EDIT_TASK,
      task: {name: "old-name", description: "old-description"},
      formSubmitCallback: jest.fn()
    }
    const expectedTask = {
      name: "new-name",
      description: "new-description"
    }

    openTaskForm(options)
    inputName.value = expectedTask.name
    inputDescription.value = expectedTask.description
    form.submit()

    expect(options.formSubmitCallback).toHaveBeenCalledWith(expectedTask)
  })

  test("edit invalid task", async () => {
    const {openTaskForm} = await import("../add-task.js")
    const options = {
      action: FORM_ACTIONS.EDIT_TASK,
      task: {name: "old-name", description: "old-description"},
      formSubmitCallback: jest.fn()
    }
    const expectedTask = {
      name: "",
      description: "new-description"
    }

    openTaskForm(options)
    inputName.value = expectedTask.name
    inputDescription.value = expectedTask.description
    form.submit()

    expect(options.formSubmitCallback).not.toHaveBeenCalled()
    expect(errorContainer.textContent).toBe(FORM_MESSAGES.EMPTY_NAME)
  })
})

test("reset form", async () => {
  const {openTaskForm} = await import("../add-task.js")

  openTaskForm({action: "action"})
  form.reset()

  expect(modalContainer.classList.contains("active")).toBeFalsy()
  expect(modal.classList.contains("action")).toBeFalsy()
})