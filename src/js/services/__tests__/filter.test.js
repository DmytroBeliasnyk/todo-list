import {filterService} from "../filter.js";

const tasks = [{name: "task1", id: 1}, {name: "task2", id: 2}]
const mockApplyFilters = vi.fn(tasks => filterService.applyFilters(tasks))

afterEach(() => {
  filterService.removeFilter(1)
  filterService.removeFilter(2)

  vi.clearAllMocks()
})

it("apply", () => {
  const filter1 = vi.fn(tasks => {
    tasks.pop()
    return tasks
  })
  const filter2 = vi.fn(tasks => {
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

it("apply: no filters", () => {
  const res = mockApplyFilters(tasks)

  expect(mockApplyFilters).toHaveReturned()
  expect(res).toEqual(tasks)
})

it("remove", () => {
  filterService.setFilter(1, vi.fn)
  const mockRemoveFilter = vi.fn(filterId => {
    filterService.removeFilter(filterId)
  })

  mockRemoveFilter(1)
  const res = mockApplyFilters(tasks)

  expect(mockRemoveFilter).toHaveReturned()
  expect(mockApplyFilters).toHaveReturned()
  expect(res).toEqual(tasks)
})