import FormService from "../../../services/form.js";

export function init(form) {
  const modal = form.closest(".modal")
  const modalContainer = modal.parentNode
  const formService = FormService(form)

  modalContainer.addEventListener("click", event => {
    if (event.target.classList.contains("modal-container")) {
      form.reset()
    }
  })

  modalContainer.addEventListener("keyup", event => {
    if (event.code === "Escape") {
      form.reset()
    }
  })

  return {
    modalContainer: modalContainer,
    modal: modal,
    formService: formService
  }
}