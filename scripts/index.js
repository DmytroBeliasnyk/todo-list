import {buttonsPanelManager} from "./buttons-panel-manager.js"
import {formManager} from "./form-manager.js"
import {taskManager} from "./task-manager.js";

/*
    добавить локальное хранилище данных
    добавить функции навигации
*/

const buttonsPanel = document.querySelector(".content__buttons-panel")
buttonsPanel.addEventListener("click", event => {
  const targetButton = event.target.closest("button")
  if (!targetButton) return

  buttonsPanelManager[targetButton.id]()
})

const form = document.querySelector(".form")
form.addEventListener("click", event => {
  const targetButton = event.target.closest("button")
  if (!targetButton) return

  formManager.event = event
  formManager[targetButton.id]()
})
form.addEventListener("keydown", event => {
  console.log(event.code)
  if (event.code !== 'Escape') return

  formManager["close-btn"]()
})

const taskContainer = document.querySelector(".content__tasks")
taskContainer.addEventListener("switchButtons", () => {
  buttonsPanelManager.buttonsSwitch(!taskContainer.querySelectorAll(".selected").length)
})
taskContainer.addEventListener("click", event => {
  taskManager.selectTask(event)
  taskContainer.dispatchEvent(new CustomEvent("switchButtons"))
})
taskContainer.addEventListener("dblclick", event => {
  taskManager.taskToEdit(event)
  formManager.openToEdit()
})
