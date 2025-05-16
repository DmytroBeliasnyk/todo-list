import {jest} from "@jest/globals"
import {filterService} from "../filter.js";

const tasks = [{name: "task1", id: 1}, {name: "task2", id: 2}]
const mockApplyFilters = jest.fn(tasks => filterService.applyFilters(tasks))

afterEach(() => {
  filterService.removeFilter(1)
  filterService.removeFilter(2)

  jest.clearAllMocks()
})

test("apply", () => {
  const filter1 = jest.fn(tasks => {
    tasks.pop()
    return tasks
  })
  const filter2 = jest.fn(tasks => {
    tasks.shift()
    return tasks
  })
  filterService.setFilter(1, filter1)
  filterService.setFilter(2, filter2)

  const res = mockApplyFilters(tasks)

  expect(mockApplyFilters).toHaveReturned()
  expect(filter1).toHaveBeenCalled()
  expect(filter2).toHaveBeenCalled()
  expect(res).toHaveLength(0)
})

test("apply: no filters", () => {
  const res = mockApplyFilters(tasks)

  expect(mockApplyFilters).toHaveReturned()
  expect(res).toEqual(tasks)
})

test("remove", () => {
  filterService.setFilter(1, jest.fn)
  const mockRemoveFilter = jest.fn(filterId => {
    filterService.removeFilter(filterId)
  })

  mockRemoveFilter(1)
  const res = mockApplyFilters(tasks)

  expect(mockRemoveFilter).toHaveReturned()
  expect(mockApplyFilters).toHaveReturned()
  expect(res).toEqual(tasks)
})