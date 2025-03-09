export const buttonsPanelManager = {
  formWrapper: document.querySelector(".form-wrapper"),
  tasks: document.querySelector(".content__tasks"),
  "content__open-form-btn": function () {
    for (const selectedTask of this.tasks.querySelectorAll(".selected")) {
      selectedTask.classList.remove("selected")
    }

    this.formWrapper.hidden = false
  },
  "content__done-btn": function () {
    const selected = this.tasks.querySelectorAll(".selected")
    for (const selectedElement of selected) {
      selectedElement.classList.remove("selected")
      selectedElement.classList.add("done")
    }
  },
  "content__remove-btn": function () {
    const selected = this.tasks.querySelectorAll(".selected")
    for (const selectedElement of selected) {
      selectedElement.remove()
    }
  },
}
