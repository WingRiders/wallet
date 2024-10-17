import {describe, expect, test} from 'bun:test'
import {MessageType, isValidMessage} from '../../src'

describe('Validation', () => {
  test('validates GATEWAY_READY message', () => {
    const valid = {
      type: MessageType.GATEWAY_READY,
    }
    const invalid = {
      type: MessageType.GATEWAY_READY,
      additionalField: '0',
    }

    expect(isValidMessage(valid)).toBe(true)
    expect(isValidMessage(invalid)).toBe(false)
  })

  test('validates INIT_REQUEST message', () => {
    const valid = {
      type: MessageType.INIT_REQUEST,
      initId: '0',
    }
    const invalid1 = {
      type: MessageType.INIT_REQUEST,
    }
    const invalid2 = {
      type: MessageType.INIT_REQUEST,
      initId: '0',
      additionalField: '0',
    }

    expect(isValidMessage(valid)).toBe(true)
    expect(isValidMessage(invalid1)).toBe(false)
    expect(isValidMessage(invalid2)).toBe(false)
  })

  test('validates INIT_RESPONSE message', () => {
    const valid = {
      type: MessageType.INIT_RESPONSE,
      initId: '0',
      result: {
        isSuccess: true,
        data: {
          network: 'mainnet',
          usedAddresses: ['cafe'],
          unusedAddresses: ['cafe'],
          changeAddress: 'cafe',
          rewardAddresses: ['cafe'],
          collateralUtxoRef: null,
        },
      },
    }
    const invalid1 = {
      type: MessageType.INIT_RESPONSE,
      initId: '0',
      result: {
        isSuccess: true,
        data: {
          network: 'mainnet',
          usedAddresses: ['cafe'],
          unusedAddresses: ['cafe'],
          changeAddress: 'cafe',
          rewardAddresses: ['cafe'],
        },
      },
    }
    const invalid2 = {
      type: MessageType.INIT_RESPONSE,
      initId: '0',
      result: {
        isSuccess: true,
        data: {
          network: 'mainnet',
          usedAddresses: ['cafe'],
          unusedAddresses: ['cafe'],
          changeAddress: 'cafe',
          rewardAddresses: ['cafe'],
          additionalField: '0',
        },
      },
    }

    expect(isValidMessage(valid)).toBe(true)
    expect(isValidMessage(invalid1)).toBe(false)
    expect(isValidMessage(invalid2)).toBe(false)
  })
  test('validates SIGN_DATA_REQUEST message', () => {
    const valid = {
      type: MessageType.SIGN_DATA_REQUEST,
      initId: '0',
      payload: {
        addr: 'cafe',
        sigStructure: 'cafe',
      },
    }
    const invalid1 = {
      type: MessageType.SIGN_DATA_REQUEST,
      initId: '0',
      payload: {
        addr: 'cafe',
      },
    }
    const invalid2 = {
      type: MessageType.SIGN_DATA_REQUEST,
      initId: '0',
      payload: {
        addr: 'cafe',
        sigStructure: 'cafe',
        additionalField: '0',
      },
    }

    expect(isValidMessage(valid)).toBe(true)
    expect(isValidMessage(invalid1)).toBe(false)
    expect(isValidMessage(invalid2)).toBe(false)
  })

  test('validates SIGN_DATA_RESPONSE message', () => {
    const valid = {
      type: MessageType.SIGN_DATA_RESPONSE,
      initId: '0',
      result: {
        isSuccess: true,
        data: 'cafe',
      },
    }
    const invalid1 = {
      type: MessageType.SIGN_DATA_RESPONSE,
      initId: '0',
    }
    const invalid2 = {
      type: MessageType.SIGN_DATA_RESPONSE,
      initId: '0',
      result: {
        isSuccess: true,
        data: 'cafe',
      },
      additionalField: '0',
    }

    expect(isValidMessage(valid)).toBe(true)
    expect(isValidMessage(invalid1)).toBe(false)
    expect(isValidMessage(invalid2)).toBe(false)
  })
})
