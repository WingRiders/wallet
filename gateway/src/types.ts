export type ResultType =
  | {
      isSuccess: true
    }
  | {
      isSuccess: false
      errorMessage?: string
    }
