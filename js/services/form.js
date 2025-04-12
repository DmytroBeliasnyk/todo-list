export default (form) => {
  const _messageContainer = form.querySelector(".form__error-message")
  const _inputNameLabel = form.querySelector("#input-name-label")

  let _callbackSubmit = null
  let _callbackReset = null
  let _callbackDone = null
  let _callbackRemove = null

  form.addEventListener("submit", e => {
    e.preventDefault()

    form.elements.name.disabled = false
    if (_callbackSubmit) _callbackSubmit(Object.fromEntries(new FormData(form)))
  })
  form.addEventListener("reset", () => {
    if (_callbackReset) _callbackReset()
  })
  form.addEventListener("done", () => {
    form.elements.name.disabled = false
    if (_callbackDone) _callbackDone(Object.fromEntries(new FormData(form)))
  })
  form.addEventListener("remove", () => {
    form.elements.name.disabled = false
    if (_callbackRemove) _callbackRemove(Object.fromEntries(new FormData(form)))
  })

  return {
    init(callbackSubmit, callbackReset, callbackDone, callbackRemove) {
      if (callbackSubmit && typeof callbackSubmit === 'function') {
        _callbackSubmit = callbackSubmit
      }
      if (callbackReset && typeof callbackReset === 'function') {
        _callbackReset = callbackReset
      }
      if (callbackDone && typeof callbackDone === 'function') {
        _callbackDone = callbackDone
      }
      if (callbackRemove && typeof callbackRemove === 'function') {
        _callbackRemove = callbackRemove
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