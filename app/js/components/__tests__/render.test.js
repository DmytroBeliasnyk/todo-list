/**
 * @jest-environment jsdom
 */
import {jest} from "@jest/globals"
import {taskRenderInit} from "../tasks/render.js";
import {TASK_STATUS} from "../../utils/constants.js";

document.body.innerHTML = `<div class="tasks__container"></div>`

const taskContainer = document.querySelector(".tasks__container")
const countOnPage = 5
const editCallback = jest.fn()
const doneCallback = jest.fn()
const removeCallback = jest.fn()

const tasksRender = taskRenderInit({
  taskContainer: taskContainer,
  countOnPage: countOnPage,
  callbacks: {
    edit: editCallback,
    done: doneCallback,
    remove: removeCallback
  }
})

afterEach(() => {
  taskContainer.replaceChildren()
})

test.each([
  ["task", {name: "name", status: TASK_STATUS.IN_PROGRESS}],
  ["donned task", {name: "name", status: TASK_STATUS.DONE}]
])
("add %s", (_, task) => {
  tasksRender.addTask(task)

  expect(taskContainer.children).toHaveLength(1)

  const taskElement = taskContainer.children.item(0)
  expect(taskElement.querySelector(".task__name").textContent).toBe(task.name)
  expect(taskElement.querySelector(".task__status").textContent).toBe(task.status)
  expect(taskElement.classList.contains("done")).toBe(task.status === TASK_STATUS.DONE)
})


test.each([
  ["edit task", "", editCallback],
  ["done button", ".task__done", doneCallback],
  ["remove button", ".task__remove", removeCallback]
])
("%s", (_, className, expectedCallback) => {
  tasksRender.addTask({name: "name"})
  const taskElement = taskContainer.children.item(0)

  if (className) {
    taskElement.querySelector(className).click()
  } else {
    taskElement.click()
  }

  expect(expectedCallback).toHaveBeenCalled()
})

describe("render", () => {
  const tasks = []
  beforeAll(() => {
    for (let i = 1; i <= 10; i++) {
      tasks.push([{name: i, description: i, status: TASK_STATUS.IN_PROGRESS}])
    }
  })

  test.each([
    ["first", () => {
    }, countOnPage],
    ["next", nextPage => {
      nextPage()
    }, countOnPage * 2],
    ["last", nextPage => {
      nextPage()
      nextPage()
    }, countOnPage * 2]
  ])
  ("%s page", (_, act, expectedCount) => {
    const nextPage = tasksRender.renderPage(tasks)

    act(nextPage)

    expect(typeof nextPage === "function").toBeTruthy()
    expect(taskContainer.children).toHaveLength(expectedCount)
  })
})