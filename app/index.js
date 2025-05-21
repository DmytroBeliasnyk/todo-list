import {initApp} from "./js/init.js";
import {openTaskForm} from "./js/components/tasks/forms/add-task.js";
import {FORM_ACTIONS} from "./js/utils/constants.js";

const render = {
  nextPage: null,
}
const {taskStorage, taskRender} = initApp(render)

const loaderObserver = new IntersectionObserver(
  (entries) => {
    if (entries[0].isIntersecting) {
      render.nextPage()
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
    openTaskForm({
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
  render.nextPage = taskRender.renderPage(taskStorage.getAll())
})