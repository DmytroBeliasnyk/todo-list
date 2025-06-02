import {debounce} from "../debounce.js";

const fn = vi.fn(done => {
  expect(fn).toHaveBeenCalled()
  done()
})

let debounceFn
beforeEach(() => {
  debounceFn = debounce(fn, 500)
})

it("debounce: one call", done => {
  debounceFn(done)
})

it("debounce: several calls", done => {
  for (let i = 0; i < 10; i++) {
    debounceFn(done)
  }
})