import {filterService} from "@/services/filter.js";
import {debounce} from "@/utils/debounce.js";
import {FILTERS_IDs, TASK_STATUS} from "@/utils/constants.js";

const filters = new Map([
  [FILTERS_IDs.SEARCH_INPUT, (tasks, searchValue) => {
    if (!searchValue) return tasks

    return tasks.filter(
      task => task.name.toLowerCase().includes(searchValue.toLowerCase())
    )
  }],
  [FILTERS_IDs.IN_PROGRESS, tasks => tasks.filter(
    task => task.status === TASK_STATUS.IN_PROGRESS
  )],
  [FILTERS_IDs.DONE, tasks => tasks.filter(
    task => task.status === TASK_STATUS.DONE,
  )],
])

export function filtersHandlersInit(getTasks, renderCallback) {
  if (typeof getTasks !== "function" || typeof renderCallback !== "function") {
    throw new Error("Invalid parameters types.")
  }
  if (document.querySelector(".navigation").dataset.handlersAttached === "true") return

  const render = () => renderCallback(
    filterService.applyFilters(
      getTasks()
    )
  )

  document.querySelector(".navigation__search")
    .addEventListener("input", event => {
      debounce(target => {
        filterService.setFilter(
          target.id,
          tasks => filters.get(target.id)(tasks, target.value.trim())
        )

        render()
      }, 250)(event.target)
    })

  document.querySelector(".navigation__filters")
    .addEventListener("click", event => {
      const targetFilter = event.target.closest(".filter")
      if (!targetFilter) return

      if (targetFilter.classList.contains("enabled")) {
        targetFilter.classList.remove("enabled")
        filterService.removeFilter(targetFilter.id)
      } else {
        for (const enabledFilter of event.currentTarget.querySelectorAll(".enabled")) {
          if (
            !enabledFilter.hasAttribute("data-enable-together") &&
            !targetFilter.hasAttribute("data-enable-together")
          ) {
            enabledFilter.classList.remove("enabled")
            filterService.removeFilter(enabledFilter.id)
          }
        }

        targetFilter.classList.add("enabled")
        filterService.setFilter(
          targetFilter.id,
          tasks => filters.get(targetFilter.id)(tasks)
        )
      }

      render()
    })

  document.querySelector(".navigation").dataset.handlersAttached = "true"
}