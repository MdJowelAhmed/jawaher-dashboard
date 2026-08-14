export function wait(ms = 380) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
