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
formInputDeadline.addEventListener("input", () => {
  const inputDate = new Date(formInputDeadline.value)
  formInputDeadline.classList.toggle("invalid", Date.now() - inputDate.getTime() > 0)
})