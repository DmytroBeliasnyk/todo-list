import {taskService} from "./services/task.js";
import RenderService from "./services/render.js";
import FormService from "./services/form.js";

const renderService = RenderService(document.querySelector(".tasks"))
renderService.renderAll(taskService.getAll())
window.addEventListener("storage", () => {
  renderService.renderAll(taskService.getAll())
})

const search = document.querySelector(".navigation__search")
search.addEventListener("input", e => {
  const searchValue = e.target.value.toLowerCase()
  console.log(searchValue)
})

/* implemented filters listeners */

const modal = document.querySelector(".modal")
const modalContainer = modal.parentNode

const taskForm = document.forms.taskForm
const formService = FormService(taskForm)

const closeForm = () => {
  modalContainer.classList.remove("active")
  modal.classList.remove("add")
}

const openFormButton = document.querySelector(".open-form-btn")
openFormButton.addEventListener("click", () => {
  modalContainer.classList.add("active")
  modal.classList.add("add")
  taskForm.elements.name.focus()

  formService.init(
    task => {
      const validName = taskService.validateTaskName(task.name)
      if (validName.hasError) {
        formService.setError(validName.errorMessage)
        return
      }

      let taskId
      do {
        taskId = crypto.randomUUID()
      } while (!taskService.isIdUnique(taskId))

      task.status = "In progress"
      task.id = taskId

      taskService.add(task)
      renderService.renderNewTask(task)

      closeForm()
      taskForm.reset()
    },
    closeForm
  )
})