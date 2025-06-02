import {FORM_MESSAGES} from "@/utils/constants.js"

document.body.innerHTML = `<div class="modal-container">
                            <div class="modal">
                              <form name="actionsForm">
                                <label class="input-name-label">
                                  <input name="name">
                                </label>
                                <div class="form__error-message"></div>
                              </form>
                            </div>
                           </div>`

const form = document.forms.actionsForm
const inputName = form.elements.name
const errorContainer = form.querySelector(".form__error-message")
const modal = form.closest(".modal")
const modalContainer = modal.parentNode

afterEach(() => {
  form.reset()
})

describe("submit form", () => {
  it("valid name", async () => {
    const {openTaskActionsForm} = await import("../actions-task.js")
    const options = {formSubmitCallback: vi.fn()}
    inputName.value = "valid-name"

    openTaskActionsForm(options)
    form.requestSubmit()

    expect(options.formSubmitCallback).toHaveBeenCalledWith("valid-name")
  })

  it("invalid name", async () => {
    const {openTaskActionsForm} = await import("../actions-task.js")
    const options = {formSubmitCallback: vi.fn()}
    inputName.value = ""

    openTaskActionsForm(options)
    form.requestSubmit()

    expect(options.formSubmitCallback).not.toHaveBeenCalled()
    expect(errorContainer.textContent).toBe(FORM_MESSAGES.EMPTY_NAME)
  })

  it("not equal name", async () => {
    const {openTaskActionsForm} = await import("../actions-task.js")
    const options = {
      formSubmitCallback: vi.fn(() => {
        throw new Error()
      })
    }
    inputName.value = "not equal name"

    openTaskActionsForm(options)
    form.requestSubmit()

    expect(options.formSubmitCallback).toHaveBeenCalledWith("not equal name")
    expect(options.formSubmitCallback).toThrowError()
    expect(errorContainer.textContent).toBe(FORM_MESSAGES.NOT_EQUAL_NAME)
  })
})

it("reset form", async () => {
  const {openTaskActionsForm} = await import("../actions-task.js")

  openTaskActionsForm({action: "action"})
  form.reset()

  expect(modalContainer.classList.contains("active")).toBeFalsy()
  expect(modal.classList.contains("action")).toBeFalsy()
})