import {FORM_MESSAGES} from "../../../utils/constants.js";
import {init} from "./init.js";

const form = document.forms.actionsForm
const {modalContainer, modal, formService} = init(form)

export function openTaskActionsForm(options) {
  modalContainer.classList.add("active")
  modal.classList.add(options.action)
  form.elements.name.focus()

  formService.init(
    formData => {
      const name = formData.name
      if (!name.trim()) {
        formService.setError(FORM_MESSAGES.EMPTY_NAME)
        return
      }

      try {
        options.formSubmitCallback(name)
        form.reset()
      } catch (error) {
        formService.setError(FORM_MESSAGES.NOT_EQUAL_NAME)
      }
    }, () => {
      modalContainer.classList.remove("active")
      modal.classList.remove(options.action)
    })
}
