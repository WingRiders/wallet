export const encryptData = async (data: Buffer, password: string) => {
  const salt = Buffer.from(crypto.getRandomValues(new Uint8Array(16)))
  const iv = Buffer.from(crypto.getRandomValues(new Uint8Array(12)))
  const key = await deriveKey(password, salt)

  const encryptedData = await crypto.subtle.encrypt(
    {name: 'AES-GCM', iv},
    key,
    data,
  )

  return {
    encryptedData: Buffer.from(encryptedData),
    salt,
    iv,
  }
}

export const decryptData = async (
  encryptedData: Buffer,
  password: string,
  salt: Buffer,
  iv: Buffer,
) => {
  const key = await deriveKey(password, salt)

  try {
    const decryptedData = await crypto.subtle.decrypt(
      {name: 'AES-GCM', iv},
      key,
      encryptedData,
    )
    return Buffer.from(decryptedData)
  } catch {
    throw new Error('Failed to decrypt data')
  }
}

const deriveKey = async (password: string, salt: Buffer) => {
  const passwordKey = await crypto.subtle.importKey(
    'raw',
    Buffer.from(password),
    'PBKDF2',
    false,
    ['deriveKey'],
  )

  const key = await crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: salt,
      iterations: 100000,
      hash: 'SHA-256',
    },
    passwordKey,
    {
      name: 'AES-GCM',
      length: 256,
    },
    false,
    ['encrypt', 'decrypt'],
  )

  return key
}
