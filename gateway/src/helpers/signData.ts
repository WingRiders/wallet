import {Ed25519PrivateKey} from '@cardano-sdk/crypto'
import * as cms from '@emurgo/cardano-message-signing-asmjs'
import type {JsCryptoProvider} from '@wingriders/cab/crypto'
import type {
  HexString as ApiHexString,
  DataSignature,
  Address as HexAddress,
} from '@wingriders/cab/dappConnector'
import type {BIP32Path, HexString} from '@wingriders/cab/types'

// inspired by https://github.com/input-output-hk/nami/blob/90c3fde445df36ca5aa6d63c4e7c5d7f3ad11c02/src/api/extension/index.js#L897
export const signData = async (
  cryptoProvider: JsCryptoProvider,
  address: HexAddress,
  addressPath: BIP32Path,
  payload: HexString,
): Promise<DataSignature> => {
  const protectedHeaders = cms.HeaderMap.new()
  protectedHeaders.set_algorithm_id(
    cms.Label.from_algorithm_id(cms.AlgorithmId.EdDSA),
  )
  protectedHeaders.set_header(
    cms.Label.new_text('address'),
    cms.CBORValue.new_bytes(Buffer.from(address, 'hex').valueOf()),
  )
  const protectedSerialized = cms.ProtectedHeaderMap.new(protectedHeaders)
  const unprotectedHeaders = cms.HeaderMap.new()
  const headers = cms.Headers.new(protectedSerialized, unprotectedHeaders)

  const builder = cms.COSESign1Builder.new(
    headers,
    Buffer.from(payload, 'hex').valueOf(),
    false,
  )
  const messageToSign = Buffer.from(
    builder.make_data_to_sign().to_bytes(),
  ).toString('hex')

  const derivedHdNode = cryptoProvider.deriveHdNode(addressPath)
  const signedSigStructureEd = Buffer.from(
    await signWithEd25519PrivateKey(derivedHdNode.secretKey, messageToSign),
  ).valueOf()

  const coseSign1 = builder.build(signedSigStructureEd)

  const key = cms.COSEKey.new(cms.Label.from_key_type(cms.KeyType.OKP))
  key.set_algorithm_id(cms.Label.from_algorithm_id(cms.AlgorithmId.EdDSA))
  key.set_header(
    cms.Label.new_int(cms.Int.new_negative(cms.BigNum.from_str('1'))),
    cms.CBORValue.new_int(
      cms.Int.new_i32(6), //Message.CurveType.Ed25519
    ),
  ) // crv (-1) set to Ed25519 (6)
  key.set_header(
    cms.Label.new_int(cms.Int.new_negative(cms.BigNum.from_str('2'))),
    cms.CBORValue.new_bytes(derivedHdNode.publicKey.valueOf()),
  ) // x (-2) set to public key

  return {
    signature: Buffer.from(coseSign1.to_bytes()).toString(
      'hex',
    ) as ApiHexString,
    key: Buffer.from(key.to_bytes()).toString('hex') as ApiHexString,
  }
}

const signWithEd25519PrivateKey = async (
  secretKey: Buffer,
  messageHex: string,
) =>
  (
    await Ed25519PrivateKey.fromExtendedBytes(secretKey.valueOf()).sign(
      messageHex as string & {__opaqueString: 'HexBlob'},
    )
  ).bytes()
