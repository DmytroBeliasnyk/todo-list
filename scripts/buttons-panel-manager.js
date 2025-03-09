export const buttonsPanelManager = {
  formWrapper: document.querySelector(".form-wrapper"),
  tasks: document.querySelector(".content__tasks"),
  "content__open-form-btn": function () {
    taskManager.call(this, "content__open-form-btn")
    this.formWrapper.hidden = false
  },
  "content__done-btn": function () {
    taskManager.call(this, "content__done-btn")
  },
  "content__remove-btn": function () {
    taskManager.call(this, "content__remove-btn")
  },

}

function taskManager(buttonClass) {
  let job
  switch(buttonClass){
    case "content__open-form-btn":
      job = (task) => {
        task.classList.remove("selected")
      }

      break
    case "content__done-btn":
      job = (task) => {
        task.classList.remove("selected")
        task.classList.add("done")
      }

      break
    case "content__remove-btn":
      job = (task) => {
        task.remove()
      }

      break
  }

  for (const selectedTask of this.tasks.querySelectorAll(".selected")) {
    job(selectedTask)
  }
}