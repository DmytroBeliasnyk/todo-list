import {FORM_MESSAGES} from "@/utils/constants.js";
import {init} from "./init.js";
import {open} from "./open.js";

const form = document.forms.taskForm
const {modalContainer, modal, formService} = init(form)

export function openTaskForm(options) {
  open(modalContainer, modal, form, options.action, options.task)

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