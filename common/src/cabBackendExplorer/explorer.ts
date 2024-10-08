import type {Address as HexAddress} from '@wingriders/cab/dappConnector'
import {makeNonNullable, networkNameToNetworkId} from '@wingriders/cab/helpers'
import {Address, addressToBechAddress} from '@wingriders/cab/ledger/plutus'
import type {
  Address as BechAddress,
  BestSlotResponse,
  HexString,
  HostedPoolMetadata,
  IBlockchainExplorer,
  NetworkName,
  ProtocolParameters,
  StakingInfoResponse,
  TxBlockInfo,
  TxSubmission,
  UTxO,
} from '@wingriders/cab/types'
import {chunk} from 'lodash'
import {parseOgmiosProtocolParameters} from '../protocolParameters'
import {type UTxOResponse, parseUTxOResponse} from './parse'

type CabBackendExplorerProps = {
  cabServerUrl: string
  network: NetworkName
}

const MAX_ADDRESS_FOR_UTXOS = 10

export class CabBackendExplorer implements IBlockchainExplorer {
  private readonly cabServerUrl: string
  private readonly network: NetworkName

  constructor({cabServerUrl, network}: CabBackendExplorerProps) {
    this.cabServerUrl = cabServerUrl
    this.network = network
  }

  async fetchUnspentTxOutputs(addresses: Array<BechAddress>): Promise<UTxO[]> {
    if (addresses.length === 0) return []

    const response: UTxO[] = []

    for (const addressesChunk of chunk(addresses, MAX_ADDRESS_FOR_UTXOS)) {
      const utxos: UTxOResponse[] = await fetch(
        `${this.cabServerUrl}/utxos?addresses=${addressesChunk.join(',')}`,
      ).then((res) => res.json())
      response.push(...utxos.map(parseUTxOResponse))
    }

    return response
  }

  async isSomeAddressUsed(addresses: Array<BechAddress>): Promise<boolean> {
    const usedAddresses = await this.filterUsedAddresses(addresses)
    return usedAddresses.size > 0
  }

  async submitTxRaw(_txHash: string, txBody: string): Promise<TxSubmission> {
    const res = await fetch(`${this.cabServerUrl}/submitTx`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({transactionCbor: txBody}),
    })

    if (!res.ok) {
      const error = await res.json()
      throw new Error(`Failed to submit transaction: ${JSON.stringify(error)}`)
    }

    const txHash = await res.text()
    return {txHash}
  }

  async filterUsedAddresses(
    addresses: Array<BechAddress>,
  ): Promise<Set<BechAddress>> {
    const usedAddresses: {address: HexAddress; firstSlot: number}[] =
      await fetch(`${this.cabServerUrl}/filterUsedAddresses`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({addresses}),
      }).then((res) => res.json())

    return new Set(
      usedAddresses.map(({address}) =>
        addressToBechAddress(
          Address.fromAddressHex(address),
          networkNameToNetworkId[this.network],
        ),
      ),
    )
  }

  async getProtocolParameters(): Promise<ProtocolParameters> {
    const res = await fetch(`${this.cabServerUrl}/protocolParameters`).then(
      (res) => res.json(),
    )
    return makeNonNullable(parseOgmiosProtocolParameters(res))
  }

  async fetchTxBlockInfo(_txHash: string): Promise<TxBlockInfo | null> {
    throw new Error('fetchTxBlockInfo not implemented.')
  }

  async getBestSlot(): Promise<BestSlotResponse> {
    throw new Error('getBestSlot not implemented.')
  }

  async getPoolInfo(_url: string): Promise<HostedPoolMetadata | null> {
    throw new Error('getPoolInfo not implemented.')
  }
  async getStakingInfo(
    _stakingKeyHashHex: HexString,
  ): Promise<StakingInfoResponse> {
    throw new Error('getStakingInfo not implemented.')
  }
}
