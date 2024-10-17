declare module 'borc' {
  export const encode: (any) => Buffer /* in reality it can also be null */
  export const decode: (Buffer) => any
  export class Tagged<T> {
    public tag: number
    public value: T
    constructor(tag: number, value: T, err: Error | null)
  }
  export class Decoder {
    constructor(opts: {tags: Record<number, (val: any) => any>})
    decodeFirst(buffer: Buffer): any
  }
}
