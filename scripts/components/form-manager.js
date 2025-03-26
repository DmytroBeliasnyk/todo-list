export const formManager = {
  formWrapper: document.querySelector(".form-wrapper"),
  form: document.querySelector(".form"),
  tasks: document.querySelector(".content__tasks"),
  "submit-btn": function submitForm() {
    this.event.preventDefault()

    const formData = new FormData(this.form)
    const task = {
      name: formData.get("name").trim(),
      description: formData.get("description"),
      deadline: formData.get("deadline"),
    }

    if (!task.name) {
      const formInputName = this.form.elements.name
      const formInputNameLabel = this.form.querySelector("#label-name")

      formInputName.classList.add("required")
      formInputNameLabel.classList.add("form__label-required")
      formInputName.addEventListener("input", () => {
        formInputName.classList.remove("required")
        formInputNameLabel.classList.remove("form__label-required")
      }, {once: true})

      return
    }

    const openedTask = this.tasks.querySelector(".toedit")
    if (openedTask) {
      if (this.edited) {
        const openedTaskName = openedTask.querySelector(".content__task-name")
        if (openedTaskName.textContent !== task.name) {
          if (checkUniqueName.call(this, task.name)) return
        }

        this.taskService.saveTask(task)
        openedTaskName.textContent = task.name
        openedTask.querySelector(".content__task-description").textContent = task.description
        openedTask.querySelector(".task-deadline").textContent = task.deadline
      }

      openedTask.classList.remove("toedit")
      this.form.elements.close.dispatchEvent(
        new MouseEvent("click", {bubbles: true}))

      return
    }

    if (checkUniqueName.call(this, task.name)) return

    this.taskService.saveTask(task)
    this.tasks.prepend(this.taskService.toHtmlElement(task))

    this.form.elements.close.dispatchEvent(
      new MouseEvent("click", {bubbles: true}))
  },
  "close-btn": function closeForm() {
    this.form.elements.name.classList.remove("required")
    this.form.elements.name.classList.remove("unique")

    this.form.querySelector("#label-name")
      .classList.remove("form__label-required")
    this.form.querySelector("#label-name")
      .classList.remove("form__label-unique")

    this.form.removeEventListener("input", switchEdit)
    this.edited = false

    this.formWrapper.hidden = true
  },
  openToEdit() {
    for (const selectedTask of this.tasks.querySelectorAll(".selected")) {
      selectedTask.classList.remove("selected")
    }
    this.tasks.dispatchEvent(new CustomEvent("switchButtons"))

    const taskElement = this.tasks.querySelector(".toedit")
    const selectedTask = this.taskService.toObject(taskElement)

    this.form.elements.name.value = selectedTask.name
    this.form.elements.description.value = selectedTask.description
    this.form.elements.deadline.value = selectedTask.deadline

    this.form.addEventListener("input", switchEdit)
    this.formWrapper.hidden = false
  },
}

function switchEdit() {
  formManager.edited = true
}

function checkUniqueName(taskName) {
  if (this.taskService.getTask(taskName)) {
    const formInputName = this.form.elements.name
    const formInputNameLabel = this.form.querySelector("#label-name")

    formInputName.classList.add("unique")
    formInputNameLabel.classList.add("form__label-unique")
    formInputName.addEventListener("input", () => {
      formInputName.classList.remove("unique")
      formInputNameLabel.classList.remove("form__label-unique")
    }, {once: true})

    return true
  }

  return false
}
