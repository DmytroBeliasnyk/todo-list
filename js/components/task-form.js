import FormService from "../services/form.js";

const modal = document.querySelector("#task-form-modal")
const modalContainer = modal.parentNode

const taskForm = document.forms.taskForm
const formService = FormService(taskForm)

export function openTaskForm(options) {
  modalContainer.classList.add("active")
  modal.classList.add(options.action)
  taskForm.elements.name.focus()

  let formOnSubmit = null
  if (options.formAddCallback && typeof options.formAddCallback === "function") {
    formOnSubmit = options.formAddCallback
  }

  if (options.formEditCallback && typeof options.formEditCallback === "function") {
    formOnSubmit = options.formEditCallback
    taskForm.elements.name.value = options.task.name
    taskForm.elements.description.value = options.task.description
  }

  formService.init(
    task => {
      const taskName = task.name.trim()
      if (!taskName) {
        formService.setError("Field \"name\" can't be empty.")
        return
      }

      task.name = taskName
      formOnSubmit(task)

      taskForm.reset()
    },
    () => {
      modalContainer.classList.remove("active")
      modal.classList.remove(options.action)
    }
  )
}
