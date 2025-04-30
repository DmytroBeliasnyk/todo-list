import {filterService} from "../services/filter.js";
import {filters} from "../utils/filters.js";
import {debounce} from "../utils/debounce.js";

export function navigationInit(getTasks, renderCallback) {
  const render = () => renderCallback(
    filterService.applyFilters(
      getTasks()
    )
  )

  document.querySelector(".navigation__search")
    .addEventListener("input", event => {
      debounce((target) => {
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
          console.log(enabledFilter.dataset, targetFilter.dataset)
          if (
            enabledFilter.dataset.hasOwnProperty('enabledTogether') &&
            targetFilter.dataset.hasOwnProperty('enabledTogether')
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
}