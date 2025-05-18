/**
 * @jest-environment jsdom
 */
import {jest} from "@jest/globals"
import {init} from "../init.js";

document.body.innerHTML = `<div class="modal-container">
                            <div class="modal">
                              <form name="test"></form>
                            </div>
                           </div>`
const testForm = document.forms.test

test("init form", () => {
  const mockInitFn = jest.fn(() => init(testForm))

  const {modalContainer, modal, formService} = mockInitFn()

  expect(mockInitFn).toHaveReturned()
  expect(modalContainer).toBeTruthy()
  expect(modal).toBeTruthy()
  expect(formService).toBeTruthy()
})

test.each([
  ["click", new MouseEvent("click")],
  ["key up", new KeyboardEvent("keyup", {code: "Escape"})]
])
("form reset on %s", (_, event) => {
  const spyReset = jest.spyOn(testForm, "reset")
  const {modalContainer} = init(testForm)

  modalContainer.dispatchEvent(event)

  expect(spyReset).toHaveBeenCalled()
})