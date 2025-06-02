import {FORM_ACTIONS, FORM_MESSAGES} from "@/utils/constants.js"

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

describe("submit form", () => {
  it("add valid task", async () => {
    const {openTaskForm} = await import("../add-task.js")
    const options = {
      action: FORM_ACTIONS.ADD_TASK,
      formSubmitCallback: vi.fn()
    }
    const expectedTask = {
      name: "it-name",
      description: "it-description"
    }
    inputName.value = expectedTask.name
    inputDescription.value = expectedTask.description

    openTaskForm(options)
    form.requestSubmit()

    expect(options.formSubmitCallback).toHaveBeenCalledWith(expectedTask)
  })

  it("add invalid task", async () => {
    const {openTaskForm} = await import("../add-task.js")
    const options = {
      action: FORM_ACTIONS.ADD_TASK,
      formSubmitCallback: vi.fn()
    }
    inputName.value = ""

    openTaskForm(options)
    form.requestSubmit()

    expect(options.formSubmitCallback).not.toHaveBeenCalled()
    expect(errorContainer.textContent).toBe(FORM_MESSAGES.EMPTY_NAME)
  })

  it("edit valid task", async () => {
    const {openTaskForm} = await import("../add-task.js")
    const options = {
      action: FORM_ACTIONS.EDIT_TASK,
      task: {name: "old-name", description: "old-description"},
      formSubmitCallback: vi.fn()
    }
    const expectedTask = {
      name: "new-name",
      description: "new-description"
    }

    openTaskForm(options)
    inputName.value = expectedTask.name
    inputDescription.value = expectedTask.description
    form.requestSubmit()

    expect(options.formSubmitCallback).toHaveBeenCalledWith(expectedTask)
  })

  it("edit invalid task", async () => {
    const {openTaskForm} = await import("../add-task.js")
    const options = {
      action: FORM_ACTIONS.EDIT_TASK,
      task: {name: "old-name", description: "old-description"},
      formSubmitCallback: vi.fn()
    }
    const expectedTask = {
      name: "",
      description: "new-description"
    }

    openTaskForm(options)
    inputName.value = expectedTask.name
    inputDescription.value = expectedTask.description
    form.requestSubmit()

    expect(options.formSubmitCallback).not.toHaveBeenCalled()
    expect(errorContainer.textContent).toBe(FORM_MESSAGES.EMPTY_NAME)
  })
})

it("reset form", async () => {
  const {openTaskForm} = await import("../add-task.js")

  openTaskForm({action: "action"})
  form.reset()

  expect(modalContainer.classList.contains("active")).toBeFalsy()
  expect(modal.classList.contains("action")).toBeFalsy()
})