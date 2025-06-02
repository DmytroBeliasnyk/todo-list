import {FORM_ACTIONS} from "@/utils/constants.js"

document.body.innerHTML = `<div class="modal-container">
                            <div class="modal">
                              <form name="itForm">
                                <input name="name">
                                <textarea name="description"></textarea>
                              </form>
                            </div>
                           </div>`

const form = document.forms.itForm
const inputName = form.elements.name
const inputDescription = form.elements.description
const modal = form.closest(".modal")
const modalContainer = modal.parentNode

afterEach(() => {
  modalContainer.classList.remove("active")
  modal.className = "modal"
  inputName.value = ""
  inputDescription.value = ""
})

it.each([
  ["add", {action: FORM_ACTIONS.ADD_TASK}],
  ["edit", {
    action: FORM_ACTIONS.EDIT_TASK,
    task: {name: "it-task", description: "it-description"},
  }],
  ["done", {action: FORM_ACTIONS.DONE_TASK}],
  ["remove", {action: FORM_ACTIONS.REMOVE_TASK}]
])
("open form to %s task", async (_, options) => {
  const {open} = await import("../open.js")
  const spyInputNameFocus = vi.spyOn(inputName, "focus")

  open(modalContainer, modal, form, options.action, options.task)

  expect(modalContainer.classList.contains("active")).toBeTruthy()
  expect(modal.classList.contains(options.action)).toBeTruthy()
  expect(spyInputNameFocus).toHaveBeenCalled()
  expect(inputName.value).toBe(options.task?.name ?? "")
  expect(inputDescription.value).toBe(options.task?.description ?? "")
})