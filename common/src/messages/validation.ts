import type {
  CborHexString,
  Address as HexAddress,
  HexString,
} from '@wingriders/cab/dappConnector'
import {NetworkName} from '@wingriders/cab/types'
import {z} from 'zod'

const MessageTypeEnum = z.enum([
  'GATEWAY_READY',
  'INIT_REQUEST',
  'INIT_RESPONSE',
  'SIGN_TX_REQUEST',
  'SIGN_TX_RESPONSE',
  'SIGN_DATA_REQUEST',
  'SIGN_DATA_RESPONSE',
])

export const MessageType = MessageTypeEnum.Enum
export type MessageType = z.infer<typeof MessageTypeEnum>

const isValidHexString = (value: unknown): value is string =>
  typeof value === 'string' && !!value.match(/^([0-9a-fA-F]{2})*$/)

const hexStringSchema = z
  .string()
  .refine((value): value is HexString => isValidHexString(value), {
    message: 'Invalid hex string',
  })

const cborHexStringSchema = z
  .string()
  .refine((value): value is CborHexString => isValidHexString(value), {
    message: 'Invalid CBOR hex string',
  })

const hexAddressSchema = z
  .string()
  .refine((value): value is HexAddress => isValidHexString(value), {
    message: 'Invalid hex address',
  })

const createResponseResult = <TDataSchema extends z.ZodSchema>(
  dataSchema: TDataSchema,
) =>
  z.discriminatedUnion('isSuccess', [
    z.strictObject({
      isSuccess: z.literal(true),
      data: dataSchema,
    }),
    z.strictObject({
      isSuccess: z.literal(false),
      errorMessage: z.string().optional(),
    }),
  ])

const messageSchema = z.discriminatedUnion('type', [
  z.strictObject({
    type: z.literal(MessageType.GATEWAY_READY),
  }),
  z.strictObject({
    type: z.literal(MessageType.INIT_REQUEST),
    initId: z.string(),
  }),
  z.strictObject({
    type: z.literal(MessageType.INIT_RESPONSE),
    initId: z.string(),
    result: createResponseResult(
      z.strictObject({
        network: z.nativeEnum(NetworkName),
        usedAddresses: z.array(hexAddressSchema),
        unusedAddresses: z.array(hexAddressSchema),
        changeAddress: hexAddressSchema,
        rewardAddresses: z.array(hexAddressSchema),
        collateralUtxoRef: z
          .object({
            txHash: z.string(),
            outputIndex: z.number(),
          })
          .nullable(),
      }),
    ),
  }),
  z.strictObject({
    type: z.literal(MessageType.SIGN_TX_REQUEST),
    initId: z.string(),
    payload: z.strictObject({
      tx: cborHexStringSchema,
      partialSign: z.boolean().optional(),
    }),
  }),
  z.strictObject({
    type: z.literal(MessageType.SIGN_TX_RESPONSE),
    initId: z.string(),
    result: createResponseResult(cborHexStringSchema),
  }),
  z.strictObject({
    type: z.literal(MessageType.SIGN_DATA_REQUEST),
    initId: z.string(),
    payload: z.strictObject({
      addr: cborHexStringSchema,
      sigStructure: cborHexStringSchema,
    }),
  }),
  z.strictObject({
    type: z.literal(MessageType.SIGN_DATA_RESPONSE),
    initId: z.string(),
    result: createResponseResult(hexStringSchema),
  }),
])

export type Message = z.infer<typeof messageSchema>

export type ConcreteMessage<TType extends MessageType> = Extract<
  Message,
  {type: TType}
>

export const isValidMessage = (message: unknown): message is Message =>
  messageSchema.safeParse(message).success

export const isMessageWithType = <TType extends MessageType>(
  message: Message,
  type: TType,
): message is ConcreteMessage<TType> => message.type === type
