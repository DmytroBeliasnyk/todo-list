export const formManager = {
  formWrapper: document.querySelector(".form-wrapper"),
  form: document.querySelector(".form"),
  tasks: document.querySelector(".content__tasks"),
  "submit-btn": function submitForm() {
    this.event.preventDefault()

    const formData = new FormData(this.form)
    const formInputName = this.form.elements.name
    if (!formInputName.value) {
      const formInputNameLabel = this.form.querySelector("#label-name")

      formInputNameLabel.classList.add("form__label-required")
      formInputName.classList.add("required")
      formInputName.addEventListener("input", () => {
        formInputNameLabel.classList.remove("required")
        formInputNameLabel.classList.remove("form__label-required")
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

    createNewTask(this.tasks, formData)
    this.form.elements.close.dispatchEvent(
      new MouseEvent("click", {bubbles: true}))
  },
  "close-btn": function closeForm() {
    this.form.elements.name.classList.remove("required")
    this.formWrapper.hidden = true
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

function createNewTask(container, formData) {
  const taskName = document.createElement("div")
  taskName.className = "content__task-name"
  taskName.textContent = formData.get("name")

  const taskDescription = document.createElement("div")
  taskDescription.className = "content__task-description"
  taskDescription.textContent = formData.get("description")

  const taskText = document.createElement("div")
  taskText.className = "content__task-text"
  taskText.appendChild(taskName)
  taskText.appendChild(taskDescription)

  const deadlineText = document.createElement("p")
  deadlineText.textContent = "Deadline:"

  const deadlineDate = document.createElement("time")
  deadlineDate.className = "task-deadline"
  deadlineDate.textContent = formData.get("deadline")

  const deadlineDateContainer = document.createElement("p")
  deadlineDateContainer.appendChild(deadlineDate)

  const taskExpire = document.createElement("div")
  taskExpire.className = "content__task-expire"
  taskExpire.appendChild(deadlineText)
  taskExpire.appendChild(deadlineDateContainer)

  const newTask = document.createElement("div")
  newTask.className = "content__task"
  newTask.appendChild(taskText)
  newTask.appendChild(taskExpire)

  container.prepend(newTask)
}

function taskElementToObject(taskElement) {
  return {
    taskName: taskElement.querySelector(".content__task-name").textContent,
    deadline: taskElement.querySelector(".task-deadline").textContent,
    taskDescription: taskElement.querySelector(".content__task-description").textContent,
  }
}