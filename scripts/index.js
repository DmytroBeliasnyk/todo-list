import {buttonsPanelManager} from "./buttons-panel-manager.js"
import {formManager} from "./form-manager.js";

const buttonsPanel = document.querySelector(".content__buttons-panel")
buttonsPanel.addEventListener("click", event => {
  const targetButton = event.target.closest("button")
  if (!targetButton) return

  buttonsPanelManager[targetButton.className]()
})

const form = document.querySelector(".form")
form.addEventListener("click", event => {
  const targetButton = event.target.closest("button")
  if (!targetButton) return

  formManager.event = event
  formManager[targetButton.className]()
})

const formInputDeadline = form.elements.deadline
formInputDeadline.addEventListener("input", formManager.dateValidation)

const taskContainer = document.querySelector(".content__tasks")
taskContainer.addEventListener("click", event => {
  const targetTask = event.target.closest(".content__task")
  if (!targetTask) return

  if (event.ctrlKey || event.metaKey) {
    targetTask.classList.toggle("selected")
    return
  }

  if (targetTask.classList.contains("selected")) {
    targetTask.classList.remove("selected")
    return
  }

  const selectedTasks = document.querySelectorAll(".selected")
  if (selectedTasks.length) {
    for (const task of selectedTasks) {
      task.classList.remove("selected")
    }
  }

  targetTask.classList.add("selected")
})
taskContainer.addEventListener("dblclick", event => {
  const targetTask = event.target.closest(".content__task")
  if (!targetTask) return

  targetTask.classList.add("toopen")
  formManager.openSelected()
})