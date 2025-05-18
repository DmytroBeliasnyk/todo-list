import {FORM_MESSAGES} from "../../../utils/constants.js";
import {init} from "./init.js";

const form = document.forms.taskForm
const {modalContainer, modal, formService} = init(form)

export function openTaskForm(options) {
  modalContainer.classList.add("active")
  modal.classList.add(options.action)
  form.elements.name.focus()

  if (options.task) {
    form.elements.name.value = options.task.name
    form.elements.description.value = options.task.description ?? ''
  }

  formService.init(
    task => {
      const taskName = task.name.trim()
      if (!taskName) {
        formService.setError(FORM_MESSAGES.EMPTY_NAME)
        return
      }

      task.name = taskName
      task.description = task.description.trim()
      options.formSubmitCallback(task)

      form.reset()
    },
    () => {
      modalContainer.classList.remove("active")
      modal.classList.remove(options.action)
    }
  )
}