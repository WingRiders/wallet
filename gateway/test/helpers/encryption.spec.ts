import {describe, expect, test} from 'vitest'
import {decryptData, encryptData} from '../../src/helpers/encryption'

describe('encryption', () => {
  test('should encrypt and decrypt data', async () => {
    const data = Buffer.from('secure data')
    const password = 'password'

    const {encryptedData, iv, salt} = await encryptData(data, password)
    const decryptedData = await decryptData(encryptedData, password, salt, iv)

    expect(decryptedData).toEqual(data)
  })

  test('should fail to decrypt data if the password is incorrect', async () => {
    const data = Buffer.from('secure data')
    const password = 'password'

    const {encryptedData, iv, salt} = await encryptData(data, password)

    expect(
      decryptData(encryptedData, 'incorrect password', salt, iv),
    ).rejects.toThrowError('Failed to decrypt data')
  })
})
