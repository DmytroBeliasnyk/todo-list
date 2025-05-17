/**
 * @jest-environment jsdom
 */
import {jest} from "@jest/globals"
import FormService from "../form.js";
import {FORM_MESSAGES} from "../../utils/constants.js";

const inputName = document.createElement("input")
inputName.name = "name"
inputName.type = "text"
const nameLabel = document.createElement("label")
nameLabel.className = "input-name-label"
nameLabel.appendChild(inputName)

const messageContainer = document.createElement("div")
messageContainer.className = "form__error-message"

const testForm = document.createElement("form")
testForm.append(nameLabel, messageContainer)

let formService
beforeEach(() => {
  formService = FormService(testForm)
})
afterEach(() => {
  jest.clearAllMocks()
})

test("form service", () => {
  const spyListeners = jest.spyOn(testForm, "addEventListener")
  const mockFn = jest.fn(
    testForm => FormService(testForm)
  )

  const res = mockFn(testForm)

  expect(mockFn).toHaveReturned()
  expect(res).toBeTruthy()
  expect(spyListeners).toHaveBeenCalledTimes(2)
})

test.each([
  ["valid params", jest.fn, jest.fn],
  ["invalid params", 123, "invalid"],
  ["undefined callbacks", undefined, undefined],
])
(`init: %s`, (_, callbackSubmit, callbackReset) => {
  const spyListener = jest.spyOn(testForm, "addEventListener")
  const spyClearError = jest.spyOn(formService, "clearError")
  const mockInit = jest.fn(() => {
    formService.init(callbackSubmit, callbackReset)
  })

  mockInit()

  expect(mockInit).toHaveReturned()
  expect(spyClearError).toHaveBeenCalled()
  if (callbackSubmit && typeof callbackSubmit === 'function' ||
    callbackReset && typeof callbackReset === 'function') {
    expect(spyListener).toHaveBeenCalledTimes(2)
  }
})

describe.each([
  ["submit", () => testForm.submit()],
  ["reset", () => testForm.reset()]
])
("form actions", (actionName, action) => {
  test(`valid callbacks: form ${actionName}`, () => {
    const mockSubmitCallback = jest.fn()
    const mockResetCallback = jest.fn()
    const mockSubmit = jest.fn(() => {
      action()
    })

    formService.init(mockSubmitCallback, mockResetCallback)
    mockSubmit()

    expect(mockSubmit).toHaveReturned()
    if (actionName === "submit") {
      expect(mockSubmitCallback).toHaveReturned()
      expect(mockResetCallback).not.toHaveReturned()
    } else {
      expect(mockResetCallback).toHaveReturned()
      expect(mockSubmitCallback).not.toHaveReturned()
    }
  })

  test.each([
    ["invalid callbacks", 123, "invalid"],
    ["undefined callbacks", undefined, undefined],
  ])
  (`%s: form ${actionName}`, (_, callbackSubmit, callbackReset) => {
    formService.init(callbackSubmit, callbackReset)
    const mockSubmit = jest.fn(() => {
      testForm.submit()
    })

    mockSubmit()

    expect(mockSubmit).toHaveReturned()
  })
})

test.each([
  ["valid", "message"],
  ["undefined", undefined]
])
("set error: %s message", (_, message) => {
  const spyListener = jest.spyOn(inputName, "addEventListener")
  const spyFocus = jest.spyOn(inputName, "focus")
  const expectedMessage = message ?? FORM_MESSAGES.UNKNOWN_ERROR

  formService.setError(message)

  expect(nameLabel.classList.contains("has-error")).toBeTruthy()
  expect(messageContainer.textContent).toBe(expectedMessage)
  expect(spyListener).toHaveBeenCalled()
  expect(spyFocus).toHaveBeenCalled()
})

test.each([
  ["", () => {
    formService.clearError()
  }],
  ["on input", () => {
    inputName.dispatchEvent(new InputEvent('input', {
      bubbles: true,
      data: "",
      inputType: "insertText"
    }))
  }]
])("clear error %s", (_, act) => {
  formService.setError("error")

  act()

  expect(nameLabel.classList.contains("has-error")).toBeFalsy()
  expect(messageContainer.textContent).toBe("")
})