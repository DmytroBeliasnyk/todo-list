import {jest} from "@jest/globals"
import {debounce} from "../debounce.js";

const fn = jest.fn(done => {
  expect(fn).toHaveBeenCalled()
  done()
})

let debounceFn
beforeEach(() => {
  debounceFn = debounce(fn, 500)
})

test("debounce: one call", done => {
  debounceFn(done)
})

test("debounce: several calls", done => {
  for (let i = 0; i < 10; i++) {
    debounceFn(done)
  }
})