export const buttonsPanelManager = {
  formWrapper: document.querySelector(".form-wrapper"),
  "content__open-form-btn": function () {
    this.formWrapper.hidden = false
  },
  "content__done-btn": function () {
  },
  "content__remove-btn": function () {
    const selected = this.formWrapper.querySelectorAll(".selected")
    for (const selectedElement of selected) {
      selectedElement.remove()
    }
  },
}
