import {init} from "../init.js";

document.body.innerHTML = `<div class="modal-container">
                            <div class="modal">
                              <form name="it"></form>
                            </div>
                           </div>`
const itForm = document.forms.it

it("init form", () => {
  const mockInitFn = vi.fn(() => init(itForm))

  const {modalContainer, modal, formService} = mockInitFn()

  expect(mockInitFn).toHaveReturned()
  expect(modalContainer).toBeTruthy()
  expect(modal).toBeTruthy()
  expect(formService).toBeTruthy()
})

it.each([
  ["click", new MouseEvent("click")],
  ["key up", new KeyboardEvent("keyup", {code: "Escape"})]
])
("form reset on %s", (_, event) => {
  const spyReset = vi.spyOn(itForm, "reset")
  const {modalContainer} = init(itForm)

  modalContainer.dispatchEvent(event)

  expect(spyReset).toHaveBeenCalled()
})