export function open(modalContainer, modal, form, action, task = null) {
  modalContainer.classList.add("active")
  modal.classList.add(action)
  form.elements.name.focus()

  if (task) {
    form.elements.name.value = task.name
    form.elements.description.value = task.description ?? ''
  }
}