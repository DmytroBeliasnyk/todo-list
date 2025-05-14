import {jest} from "@jest/globals"
import {taskStorageInit} from "../task-storage.js";
import {TASK_STORAGE_KEY, TASK_STATUS} from "../../../utils/constants.js";

test("task storage init", () => {
  expect(taskStorageInit(mockLocalStorage(), TASK_STORAGE_KEY)).toBeTruthy()
})

describe("add", () => {
  let mockStorage
  let taskStorage

  describe("valid task", () => {
    const validTask = {name: "task", id: 1}

    beforeEach(() => {
      mockStorage = mockLocalStorage()
      mockStorage.setItem(TASK_STORAGE_KEY, JSON.stringify([validTask]))

      taskStorage = taskStorageInit(mockStorage, TASK_STORAGE_KEY)
    })

    test.each([
      ["valid", {...validTask}, {...validTask, status: TASK_STATUS.IN_PROGRESS}],
      ["has status", {...validTask, status: TASK_STATUS.IN_PROGRESS},
        {...validTask, status: TASK_STATUS.IN_PROGRESS}],
      ["has description", {...validTask, description: "description"},
        {...validTask, description: "description", status: TASK_STATUS.IN_PROGRESS}],
    ])(
      "%s",
      (_, inputTask, expectedTask) => {
        taskStorage.add(inputTask)

        const tasks = JSON.parse(mockStorage.getItem(TASK_STORAGE_KEY) || "[]")

        expect(tasks).toHaveLength(2)
        expect(tasks[0]).toEqual(expectedTask)
        expect(mockStorage.setItem).toHaveBeenLastCalledWith(TASK_STORAGE_KEY, JSON.stringify(tasks))
      })
  })

  describe("invalid task", () => {
    beforeEach(() => {
      mockStorage = mockLocalStorage()
      taskStorage = taskStorageInit(mockStorage, TASK_STORAGE_KEY)
    })

    test.each([
      ["empty name", {name: "", id: 1}],
      ["no name", {id: 1}],
      ["no id", {name: "name"}],
      ["undefined task", undefined],
    ])(
      "%s",
      (_, inputTask) => {
        expect(() => taskStorage.add(inputTask)).toThrowError()
        expect(mockStorage.setItem).not.toHaveBeenCalled()
        expect(JSON.parse(mockStorage.getItem(TASK_STORAGE_KEY) || "[]")).toHaveLength(0)
      })
  })
})

test("get all", () => {
  const mockStorage = mockLocalStorage()
  const taskStorage = taskStorageInit(mockStorage, TASK_STORAGE_KEY)

  const res = taskStorage.getAll()

  expect(res).toEqual(JSON.parse(mockStorage.getItem(TASK_STORAGE_KEY) || "[]"))
})

describe("update", () => {
  let mockStorage
  let taskStorage
  beforeEach(() => {
    mockStorage = mockLocalStorage()
    mockStorage.setItem(TASK_STORAGE_KEY, JSON.stringify([{
      name: "name",
      description: "description",
      id: 1,
      status: "in progress"
    }]))

    taskStorage = taskStorageInit(mockStorage, TASK_STORAGE_KEY)
    mockStorage.setItem.mockClear()
  })

  describe("valid task", () => {
    test.each([
      ["new name", {name: "new name", id: 1, status: "in progress"}],
      ["new description", {name: "name", description: "new description", id: 1, status: "in progress"}],
      ["new status", {name: "name", id: 1, status: "done"}],
      ["no new properties", {name: "name", description: "description", id: 1, status: "in progress"}],
    ])(
      "%s",
      (_, inputTask) => {
        taskStorage.update(inputTask)

        const tasks = JSON.parse(mockStorage.getItem(TASK_STORAGE_KEY) || "[]")

        expect(mockStorage.setItem).toHaveBeenCalledWith(TASK_STORAGE_KEY, JSON.stringify([inputTask]))
        expect(tasks).toHaveLength(1)
        expect(tasks[0]).toEqual(inputTask)
      }
    )
  })

  describe("invalid task", () => {
    test.each([
      ["no id", {name: "name", status: "in progress"}],
      ["no name", {id: 1, status: "in progress"}],
      ["no existent id", {name: "name", id: -1, status: "in progress"}],
      ["undefined task", undefined]
    ])(
      "%s",
      (_, inputTask) => {
        expect(() => taskStorage.update(inputTask)).toThrowError()
        expect(mockStorage.setItem).not.toHaveBeenCalled()
      }
    )

    test("no status", () => {
      taskStorage.update({name: "name", id: 1})

      const tasks = JSON.parse(mockStorage.getItem(TASK_STORAGE_KEY) || "[]")

      expect(mockStorage.setItem).toHaveBeenCalledWith(
        TASK_STORAGE_KEY,
        JSON.stringify([{name: "name", id: 1, status: TASK_STATUS.IN_PROGRESS}])
      )
      expect(tasks).toHaveLength(1)
      expect(tasks[0]).toEqual({name: "name", id: 1, status: TASK_STATUS.IN_PROGRESS})
    })
  })
})

describe("remove", () => {
  let mockStorage
  let taskStorage

  beforeEach(() => {
    mockStorage = mockLocalStorage()
    mockStorage.setItem(
      TASK_STORAGE_KEY,
      JSON.stringify([{name: "name", id: 1}, {name: "name", id: 2}])
    )

    taskStorage = taskStorageInit(mockStorage, TASK_STORAGE_KEY)
    mockStorage.setItem.mockClear()
  })

  test("valid task", () => {
    const inputTask = {name: "name", id: 1}
    taskStorage.remove(inputTask)

    const tasks = JSON.parse(mockStorage.getItem(TASK_STORAGE_KEY) || "[]")

    expect(mockStorage.setItem).toHaveBeenCalledWith(TASK_STORAGE_KEY, JSON.stringify([{name: "name", id: 2}]))
    expect(tasks).toHaveLength(1)
    expect(tasks[0].id).toBe(2)
  })
  describe("invalid task", () => {
    test.each([
      ["no id", {name: "name"}],
      ["no existent id", {name: "name", id: -1}],
    ])("%s", (_, inputTask) => {
      expect(() => taskStorage.remove(inputTask)).toThrowError()
      expect(mockStorage.setItem).not.toHaveBeenCalled()
    })
  })
})

function mockLocalStorage() {
  const store = {}

  return {
    getItem: jest.fn(key => store[key] || null),
    setItem: jest.fn((key, value) => {
      store[key] = value
    }),
  }
}