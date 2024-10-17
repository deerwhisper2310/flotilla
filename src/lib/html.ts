import {sleep} from "@welshman/lib"

export const copyToClipboard = (text: string) => {
  const {activeElement} = document
  const input = document.createElement("textarea")

  input.innerHTML = text
  document.body.appendChild(input)
  input.select()

  const result = document.execCommand("copy")

  document.body.removeChild(input)
  ;(activeElement as HTMLElement).focus()

  return result
}

type ScrollerOpts = {
  onScroll: () => any
  element: Element
  threshold?: number
  reverse?: boolean
  delay?: number
}

export const createScroller = ({
  onScroll,
  element,
  delay = 1000,
  threshold = 2000,
  reverse = false,
}: ScrollerOpts) => {
  let done = false

  const check = async () => {
    const container = element.closest(".scroll-container")

    if (container) {
      // While we have empty space, fill it
      const {scrollY, innerHeight} = window
      const {scrollHeight, scrollTop} = container
      const offset = Math.abs(scrollTop || scrollY)
      const shouldLoad = offset + innerHeight + threshold > scrollHeight

      // Only trigger loading the first time we reach the threshold
      if (shouldLoad) {
        await onScroll()
      }
    }

    // No need to check all that often
    await sleep(delay)

    if (!done) {
      requestAnimationFrame(check)
    }
  }

  requestAnimationFrame(check)

  return {
    check,
    stop: () => {
      done = true
    },
  }
}
