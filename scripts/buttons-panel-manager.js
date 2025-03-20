export const buttonsPanelManager = {
  formWrapper: document.querySelector(".form-wrapper"),
  form: document.querySelector(".form"),
  tasks: document.querySelector(".content__tasks"),
  buttons: {
    removeButton: document.querySelector(".content__remove-btn"),
    doneButton: document.querySelector(".content__done-btn"),
  },
  "add-btn": function () {
    taskManager.call(this, "add-btn")

    this.formWrapper.hidden = false
    this.form.name.focus()
  },
  "done-btn": function () {
    taskManager.call(this, "done-btn")
  },
  "remove-btn": function () {
    taskManager.call(this, "remove-btn")
  },
  buttonsSwitch(enable) {
    this.buttons.removeButton.disabled = enable
    this.buttons.doneButton.disabled = enable
  },
}

function taskManager(buttonClass) {
  let job
  switch (buttonClass) {
    case "add-btn":
      job = (task) => {
        task.classList.remove("selected")
      }

      break
    case "done-btn":
      job = (task) => {
        task.classList.remove("selected")
        task.classList.add("done")
      }

      break
    case "remove-btn":
      job = (task) => {
        task.remove()
      }

      break
  }

  for (const selectedTask of this.tasks.querySelectorAll(".selected")) {
    job(selectedTask)
  }
  this.tasks.dispatchEvent(new CustomEvent("switchButtons"))
}