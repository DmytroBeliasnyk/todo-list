import {filtersHandlersInit} from "../filters.js"
import {TASK_STATUS} from "@/utils/constants.js"

vi.useFakeTimers()

document.body.innerHTML = `
            <div class="navigation">
              <input class="navigation__search" id="search">
              <div class="navigation__filters">
                <div class="filter" id="filter-in-progress"></div>
                <div class="filter" id="filter-done"></div>
              </div>
            </div>`

const search = document.querySelector(".navigation__search")
const filtersContainer = document.querySelector(".navigation__filters")
const filterInProgress = document.querySelector("#filter-in-progress")
const filterDone = document.querySelector("#filter-done")

const spySearchListener = vi.spyOn(search, "addEventListener")
const spyFiltersListener = vi.spyOn(filtersContainer, "addEventListener")

const tasks = [
  {name: "task1", status: TASK_STATUS.IN_PROGRESS},
  {name: "task2", status: TASK_STATUS.IN_PROGRESS},
  {name: "task3", status: TASK_STATUS.DONE}
]
const mockRenderCallback = vi.fn()
const mockFiltersHandlersInit = vi.fn(() => {
  filtersHandlersInit(() => tasks, mockRenderCallback)
})
mockFiltersHandlersInit()

afterEach(() => {
  vi.clearAllMocks()
  vi.clearAllTimers()
})

describe("init filters handlers", () => {
  it("valid params", () => {
    expect(mockFiltersHandlersInit).toHaveReturned()
    expect(spySearchListener).toHaveBeenCalled()
    expect(spyFiltersListener).toHaveBeenCalled()
  })

  it("repeat call", () => {
    const mockInitFn = vi.fn(() => {
      filtersHandlersInit(vi.fn(), vi.fn())
    })

    mockInitFn()

    expect(mockInitFn).toHaveReturned()
    expect(spySearchListener).not.toHaveBeenCalled()
    expect(spyFiltersListener).not.toHaveBeenCalled()
  })

  it("invalid params", () => {
    const mockInitFn = vi.fn(() => {
      filtersHandlersInit(123, "123")
    })

    expect(() => mockInitFn()).toThrowError()
    expect(spySearchListener).not.toHaveBeenCalled()
    expect(spyFiltersListener).not.toHaveBeenCalled()
  })
})

describe("search", () => {
  it.each([
    ["task", tasks],
    ["1", [{name: "task1", status: TASK_STATUS.IN_PROGRESS}]],
    ["no task", []],
    [" ", tasks],
    ["", tasks]
  ])
  ("by input value: %s", (value, expectedTasks) => {
    search.value = value
    search.dispatchEvent(new InputEvent("input", {
      bubbles: true,
      data: value,
      inputType: "insertText"
    }))

    expect(mockRenderCallback).not.toHaveBeenCalled()

    vi.advanceTimersByTime(250)
    expect(mockRenderCallback).toHaveBeenCalledWith(expectedTasks)
  })
})

describe("filters", () => {
  afterEach(() => {
    document.querySelectorAll(".enabled").forEach(filter => {
      filter.click()
    })
  })
  afterAll(() => {
    delete filterInProgress.dataset.enableTogether
  })

  it("click on container", () => {
    const spyFiltersContainer = vi.spyOn(filtersContainer, "click")
    filterInProgress.classList.add("enabled")

    filtersContainer.click()

    expect(spyFiltersContainer).toHaveReturned()
    expect(filterInProgress.classList.contains("enabled")).toBeTruthy()
    expect(filterDone.classList.contains("enabled")).toBeFalsy()
  })

  it.each([
    ["in progress", filterInProgress, [
      {name: "task1", status: TASK_STATUS.IN_PROGRESS},
      {name: "task2", status: TASK_STATUS.IN_PROGRESS},
    ]],
    ["done", filterDone, [
      {name: "task3", status: TASK_STATUS.DONE}
    ]]
  ])
  ("enable filter %s", (_, targetFilter, expectedTasks) => {
    targetFilter.click()

    expect(targetFilter.classList.contains("enabled")).toBeTruthy()
    expect(document.querySelectorAll(".enabled")).toHaveLength(1)
    expect(mockRenderCallback).toHaveBeenCalledWith(expectedTasks)
  })

  it.each([
    ["in progress", filterInProgress],
    ["done", filterDone]
  ])
  ("disable filter %s", (_, targetFilter) => {
    // enable filter
    targetFilter.click()

    //disable filter
    targetFilter.click()

    expect(targetFilter.classList.contains("enabled")).toBeFalsy()
    expect(document.querySelectorAll(".enabled")).toHaveLength(0)
    expect(mockRenderCallback).lastCalledWith(tasks)
  })

  it("enable together", () => {
    filterInProgress.dataset.enableTogether = ""

    filterInProgress.click()
    filterDone.click()

    expect(filterInProgress.classList.contains("enabled")).toBeTruthy()
    expect(filterDone.classList.contains("enabled")).toBeTruthy()
    expect(mockRenderCallback).lastCalledWith([])
  })
})

it.each([
  ["task", filterInProgress, [
    {name: "task1", status: TASK_STATUS.IN_PROGRESS},
    {name: "task2", status: TASK_STATUS.IN_PROGRESS}
  ]],
  ["2", filterInProgress, [
    {name: "task2", status: TASK_STATUS.IN_PROGRESS}
  ]],
  ["2", filterDone, []]
])
("filters with search input", (inputValue, targetFilter, expectedTasks) => {
  search.value = inputValue
  search.dispatchEvent(new InputEvent("input", {
    bubbles: true,
    data: inputValue,
    inputType: "insertText"
  }))
  targetFilter.click()

  expect(mockRenderCallback).lastCalledWith(expectedTasks)
})