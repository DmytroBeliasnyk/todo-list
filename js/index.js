import {taskService} from "./services/task.js";
import {formValidator} from "./services/form-validator.js";
import {renderTask} from "./services/render.js";
import {formService} from "./services/form.js";

const taskContainer = document.querySelector(".tasks")

const tasks = taskService.getAll()
if (tasks.length) {
  console.log("render all tasks")
  tasks
    .map(task => renderTask(task))
    .forEach(taskElement => taskContainer.append(taskElement))
}

const search = document.querySelector(".navigation__search")
search.addEventListener("input", e => {
  const searchValue = e.target.value.toLowerCase()
  console.log(searchValue)
})

/* implemented filters listeners */

const modal = document.querySelector(".modal")
const modalContainer = modal.parentNode

const taskForm = document.forms.taskForm
const form = formService(taskForm)

const closeForm = () => {
  modalContainer.classList.remove("active")
  modal.classList.remove("add")
}

const openFormButton = document.querySelector(".open-form-btn")
openFormButton.addEventListener("click", () => {
  modalContainer.classList.add("active")
  modal.classList.add("add")

  taskForm.elements.name.focus()

  form.init(
    task => {
      const validName = formValidator.validateTaskName(task.name)
      if (validName.hasError) {
        form.setError(validName.errorMessage)
        return
      }

      taskService.add(task)
      taskContainer.prepend(renderTask(task))

      closeForm()
      taskForm.reset()
    },
    closeForm
  )
})