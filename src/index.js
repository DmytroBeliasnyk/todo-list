import {initApp} from "@/init-app.js";
import {FORM_ACTIONS} from "@/utils/constants.js";

const actions = {
  renderNextPage: null,
  openTaskForm: null,
}
const {taskStorage, taskRender} = initApp(actions)

const loaderObserver = new IntersectionObserver(
  (entries) => {
    if (entries[0].isIntersecting) {
      actions.renderNextPage()
    }
  },
  {
    root: document.querySelector(".tasks"),
    threshold: 0.1,
  }
)
loaderObserver.observe(document.querySelector("#tasks__loader"))

document.querySelector(".open-task-form-add-task")
  .addEventListener("click", () => {
    actions.openTaskForm({
      action: FORM_ACTIONS.ADD_TASK,
      formSubmitCallback: (task) => {
        task.id = crypto.randomUUID()

        try {
          taskStorage.add(task)
          taskRender.addTask(task)
        } catch (error) {
          console.error(error)
        }
      },
    })
  })

window.addEventListener("storage", () => {
  actions.renderNextPage = taskRender.renderPage(taskStorage.getAll())
})