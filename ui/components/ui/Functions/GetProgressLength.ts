function getProgressLength(steps: number): number {
  // total % / (total steps / current step - 1)
  return 100 / (6 / (steps - 1))
}

export {getProgressLength}