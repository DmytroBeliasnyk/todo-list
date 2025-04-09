export const formService = (form) => {
  const _messageContainer = form.querySelector(".form__error-message")
  const _inputNameLabel = form.querySelector("#input-name-label")

  let _callbackSubmit = null
  let _callbackReset = null

  form.addEventListener("submit", e => {
    e.preventDefault()

    if (_callbackSubmit) _callbackSubmit(Object.fromEntries(new FormData(form)))
  })
  form.addEventListener("reset", e => {
    if (_callbackReset) _callbackReset()
  })

  return {
    init(callbackSubmit, callbackReset) {
      if (callbackSubmit && typeof callbackSubmit === 'function') {
        _callbackSubmit = callbackSubmit
      }
      if (callbackReset && typeof callbackReset === 'function') {
        _callbackReset = callbackReset
      }

      this.clearError()
    },
    setError(errorMessage) {
      _inputNameLabel.classList.add("has-error")
      _messageContainer.innerText = errorMessage

      const inputName = form.elements.name
      inputName.addEventListener("input", () => this.clearError(), {once: true})
      inputName.focus()
    },
    clearError() {
      _inputNameLabel.classList.remove("has-error")
      _messageContainer.innerText = ''
    },
  }
}