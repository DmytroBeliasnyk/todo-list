import FormService from "../../services/form.js";
import {formConstants} from "../../utils/constants.js";

const modal = document.querySelector("#task-form-modal")
const modalContainer = modal.parentNode

const form = document.forms.taskForm
const formService = FormService(form)

export function taskFormInit(options) {
  document.querySelector(".open-task-form-add-task")
    .addEventListener("click", () => {
      openTaskForm({
        action: formConstants.actions.addTask,
        formSubmitCallback: (task) => {
          task.id = crypto.randomUUID()

          options.addCallback(task)
        },
      })
    })

  modalContainer.addEventListener("click", event => {
    if (event.target.closest(".modal")) return

    form.reset()
  })
}

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
        formService.setError(formConstants.messages.formEmptyName)
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