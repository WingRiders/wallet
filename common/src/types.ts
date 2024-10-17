//type  Type utility to convert bigint response to number or BigNumber as parsed with json-bigint
export type Convert<U, V, O extends object> = {
  [K in keyof O]: O[K] extends object
    ? Convert<U, V, O[K]>
    : O[K] extends U
      ? V
      : O[K]
}
