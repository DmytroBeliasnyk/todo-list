import FormService from "../../services/form.js";
import {FORM_CONSTANTS} from "../../utils/constants.js";

const modal = document.querySelector("#task-actions-form-modal")
const modalContainer = modal.parentNode

const form = document.forms.actionsForm
const formService = FormService(form)

modalContainer.addEventListener("click", event => {
    if (event.target.className === "modal-container") {
      form.reset()
    }
  }
)

modalContainer.addEventListener("keyup", event => {
  if (event.code === "Escape") {
    form.reset()
  }
})

export function openTaskActionsForm(options) {
  modalContainer.classList.add("active")
  modal.classList.add(options.action)
  form.elements.name.focus()

  formService.init(
    formData => {
      const name = formData.name
      if (!name.trim()) {
        formService.setError(FORM_CONSTANTS.MESSAGES.EMPTY_NAME)
        return
      }

      try {
        options.formSubmitCallback(name)
        form.reset()
      } catch (error) {
        formService.setError(FORM_CONSTANTS.MESSAGES.NOT_EQUAL_NAME)
      }
    }, () => {
      modalContainer.classList.remove("active")
      modal.classList.remove(options.action)
    })
}
