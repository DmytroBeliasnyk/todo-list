import FormService from "../../services/form.js";
import {constants} from "../../utils/constants.js";

const modal = document.querySelector("#task-form-modal")
const modalContainer = modal.parentNode

const form = document.forms.taskForm
const formService = FormService(form)

export function taskFormInit(formAddCallback) {
  document.querySelector(".open-task-form-add-task")
    .addEventListener("click", () => {
      openTaskForm({
        action: constants.form.actions.addTask,
        formAddCallback: (task) => {
          task.id = crypto.randomUUID()

          formAddCallback(task)
        },
      })
    })
}

export function openTaskForm(options) {
  modalContainer.classList.add("active")
  modal.classList.add(options.action)
  form.elements.name.focus()

  let formOnSubmit = null
  if (options.formAddCallback && typeof options.formAddCallback === "function") {
    formOnSubmit = options.formAddCallback
  }

  if (options.formEditCallback && typeof options.formEditCallback === "function") {
    formOnSubmit = options.formEditCallback
    form.elements.name.value = options.task.name
    form.elements.description.value = options.task.description
  }

  formService.init(
    task => {
      const taskName = task.name.trim()
      if (!taskName) {
        formService.setError(constants.form.messages.formEmptyName)
        return
      }

      task.name = taskName
      formOnSubmit(task)

      form.reset()
    },
    () => {
      modalContainer.classList.remove("active")
      modal.classList.remove(options.action)
    }
  )
}