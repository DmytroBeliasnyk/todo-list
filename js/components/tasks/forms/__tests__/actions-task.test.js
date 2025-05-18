/**
 * @jest-environment jsdom
 */
import {jest} from "@jest/globals"
import {FORM_MESSAGES} from "../../../../utils/constants.js"

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
  test("valid input", async () => {
    const {openTaskActionsForm} = await import("../actions-task.js")
    const options = {formSubmitCallback: jest.fn()}
    inputName.value = "valid-name"

    openTaskActionsForm(options)
    form.submit()

    expect(options.formSubmitCallback).toHaveBeenCalledWith("valid-name")
  })

  test("invalid input", async () => {
    const {openTaskActionsForm} = await import("../actions-task.js")
    const options = {formSubmitCallback: jest.fn()}
    inputName.value = ""

    openTaskActionsForm(options)
    form.submit()

    expect(options.formSubmitCallback).not.toHaveBeenCalled()
    expect(errorContainer.textContent).toBe(FORM_MESSAGES.EMPTY_NAME)
  })
})

test("reset form", async () => {
  const {openTaskActionsForm} = await import("../actions-task.js")

  openTaskActionsForm({action: "action"})
  form.reset()

  expect(modalContainer.classList.contains("active")).toBeFalsy()
  expect(modal.classList.contains("action")).toBeFalsy()
})