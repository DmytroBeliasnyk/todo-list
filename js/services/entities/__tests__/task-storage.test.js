import {taskStorage} from "../task-storage.js";

global.localStorage = (() => {
  let store = {}

  return {
    getItem: key => store[key] || null,
    setItem: (key, value) => {
      store[key] = value.toString()
    },
    removeItem: key => {
      delete store[key]
    },
    clear: () => {
      store = {}
    }
  }
})()

test("taskStorage init", () => {
  expect(taskStorage).toBeTruthy()
})