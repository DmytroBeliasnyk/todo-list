export const formManager = {
  formWrapper: document.querySelector(".form-wrapper"),
  form: document.querySelector(".form"),
  tasks: document.querySelector(".content__tasks"),
  "form__submit-btn": function submitForm() {
    this.event.preventDefault()

    if (this.form.elements.deadline.classList.contains("invalid")) return

    const formData = new FormData(this.form)
    const formInputName = this.form.elements.name
    if (!formInputName.value) {
      formInputName.classList.add("required")
      formInputName.addEventListener("input", () => {
        formInputName.classList.remove("required")
      }, {once: true})

      return
    }

    const openedTask = this.tasks.querySelector(".toedit")
    if (openedTask) {
      const formElements = this.form.elements

      openedTask.querySelector(".content__task-name").textContent = formElements.name.value
      openedTask.querySelector(".task-deadline").textContent = formElements.deadline.value
      openedTask.querySelector(".content__task-description").textContent = formElements.description.value

      openedTask.classList.remove("toedit")
      this.form.elements.close.dispatchEvent(
        new MouseEvent("click", {bubbles: true}))

      return
    }

    this.tasks.insertAdjacentHTML("afterbegin", createNewTask(formData))
    this.form.elements.close.dispatchEvent(
      new MouseEvent("click", {bubbles: true}))
  },
  "form__close-btn": function closeForm() {
    this.form.elements.name.classList.remove("required")
    this.form.elements.deadline.classList.remove("invalid")

    this.formWrapper.hidden = true
  },
  dateValidation() {
    const inputDeadline = this.form.elements.deadline
    const inputDate = new Date(inputDeadline.value)

    inputDeadline.classList.toggle("invalid", Date.now() - inputDate.getTime() > 0)
  },
  openToEdit() {
    for (const selectedTask of this.tasks.querySelectorAll(".selected")) {
      selectedTask.classList.remove("selected")
    }
    this.tasks.dispatchEvent(new CustomEvent("switchButtons"))

    const selectedTask = this.tasks.querySelector(".toedit")
    const selectedTaskObj = taskElementToObject(selectedTask)

    this.form.elements.name.value = selectedTaskObj.taskName
    this.form.elements.deadline.value = selectedTaskObj.deadline
    this.form.elements.description.value = selectedTaskObj.taskDescription

    this.formWrapper.hidden = false
  },
}

function createNewTask(formData) {
  return `<div class="content__task">
            <div class="content__task-text">
              <div class="content__task-name">${formData.get("name")}</div>
              <div class="content__task-description">${formData.get("description")}</div>
            </div>
            <div class="content__task-expire">
              <p>Deadline:</p>
              <p>
                <time datetime="YYYY-MM-DD" class="task-deadline">${formData.get("deadline")}</time>
              </p>
            </div>
          </div>`
}

function taskElementToObject(taskElement) {
  return {
    taskName: taskElement.querySelector(".content__task-name").textContent,
    deadline: taskElement.querySelector(".task-deadline").textContent,
    taskDescription: taskElement.querySelector(".content__task-description").textContent,
  }
}