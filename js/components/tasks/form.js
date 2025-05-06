import FormService from "../../services/form.js";
import {formConstants} from "../../utils/constants.js";

const modal = document.querySelector("#task-form-modal")
const modalContainer = modal.parentNode

const form = document.forms.taskForm
const editButtons = form.querySelector(".form__edit-buttons")
const openEditButtonsButton = editButtons.previousElementSibling

const formService = FormService(form)

export function taskFormInit(formAddCallback) {
  document.querySelector(".open-task-form-add-task")
    .addEventListener("click", () => {
      openTaskForm({
        action: formConstants.actions.addTask,
        formSubmitCallback: (task) => {
          task.id = crypto.randomUUID()

          formAddCallback(task)
        },
      })
    })

  openEditButtonsButton.addEventListener("click", () => {
    editButtons.classList.toggle("show")
    openEditButtonsButton.classList.toggle("open")
  })

  modalContainer.addEventListener("click", event => {
    if (event.target.closest(".form__open-edit-buttons-btn")) return

    editButtons.classList.toggle("show", false)
    openEditButtonsButton.classList.toggle("open", false)
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
      options.formSubmitCallback(task)

      form.reset()
    },
    () => {
      modalContainer.classList.remove("active")
      modal.classList.remove(options.action)
    }
  )
}