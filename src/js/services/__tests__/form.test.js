import {formService} from "../form.js";
import {FORM_MESSAGES} from "@/utils/constants.js";

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

let service
beforeEach(() => {
  service = formService(testForm)
})
afterEach(() => {
  vi.clearAllMocks()
})

it("init form service", () => {
  const spyListeners = vi.spyOn(testForm, "addEventListener")
  const mockFn = vi.fn(() => formService(testForm))

  const res = mockFn()

  expect(mockFn).toHaveReturned()
  expect(res).toBeTruthy()
  expect(spyListeners).toHaveBeenCalledTimes(2)
})

it.each([
  ["valid params", vi.fn(), vi.fn()],
  ["invalid params", 123, "invalid"],
  ["undefined callbacks", undefined, undefined],
])
(`init: %s`, (_, callbackSubmit, callbackReset) => {
  const spyClearError = vi.spyOn(service, "clearError")
  const mockInit = vi.fn(() => {
    service.init(callbackSubmit, callbackReset)
  })

  mockInit()

  expect(mockInit).toHaveReturned()
  expect(spyClearError).toHaveBeenCalled()
})

describe.each([
  ["submit", () => testForm.requestSubmit()],
  ["reset", () => testForm.reset()]
])
("form actions", (actionName, action) => {
  it(`valid callbacks: form ${actionName}`, () => {
    const mockSubmitCallback = vi.fn()
    const mockResetCallback = vi.fn()
    const mockSubmit = vi.fn(() => {
      action()
    })

    service.init(mockSubmitCallback, mockResetCallback)
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

  it.each([
    ["invalid callbacks", 123, "invalid"],
    ["undefined callbacks", undefined, undefined],
  ])
  (`%s: form ${actionName}`, (_, callbackSubmit, callbackReset) => {
    service.init(callbackSubmit, callbackReset)
    const mockSubmit = vi.fn(() => {
      testForm.requestSubmit()
    })

    mockSubmit()

    expect(mockSubmit).toHaveReturned()
  })
})

it.each([
  ["valid", "message"],
  ["undefined", undefined]
])
("set error: %s message", (_, message) => {
  const spyListener = vi.spyOn(inputName, "addEventListener")
  const spyFocus = vi.spyOn(inputName, "focus")
  const expectedMessage = message ?? FORM_MESSAGES.UNKNOWN_ERROR

  service.setError(message)

  expect(nameLabel.classList.contains("has-error")).toBeTruthy()
  expect(messageContainer.textContent).toBe(expectedMessage)
  expect(spyListener).toHaveBeenCalled()
  expect(spyFocus).toHaveBeenCalled()
})

it.each([
  ["", () => {
    service.clearError()
  }],
  ["on input", () => {
    inputName.dispatchEvent(new InputEvent('input', {
      bubbles: true,
      data: "",
      inputType: "insertText"
    }))
  }]
])
("clear error %s", (_, act) => {
  service.setError("error")

  act()

  expect(nameLabel.classList.contains("has-error")).toBeFalsy()
  expect(messageContainer.textContent).toBe("")
})