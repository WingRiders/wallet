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
import {parseOgmiosProtocolParameters} from '../protocolParameters'
import {type UTxOResponse, parseUTxOResponse} from './parse'

type CabBackendExplorerProps = {
  url: string
  network: NetworkName
}

export class CabBackendExplorer implements IBlockchainExplorer {
  private readonly url: string
  private readonly network: NetworkName

  constructor({url, network}: CabBackendExplorerProps) {
    this.url = url
    this.network = network
  }

  async fetchUnspentTxOutputs(addresses: Array<BechAddress>): Promise<UTxO[]> {
    if (addresses.length === 0) return []

    const utxos: UTxOResponse[] = await fetch(
      `${this.url}/utxos?addresses=${addresses.join(',')}`,
    ).then((res) => res.json())
    return utxos.map(parseUTxOResponse)
  }

  async isSomeAddressUsed(addresses: Array<BechAddress>): Promise<boolean> {
    const usedAddresses = await this.filterUsedAddresses(addresses)
    return usedAddresses.size > 0
  }

  async submitTxRaw(_txHash: string, txBody: string): Promise<TxSubmission> {
    const res: string = await fetch(`${this.url}/submitTx`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({transactionCbor: txBody}),
    }).then((res) => res.text())

    return {
      txHash: res,
    }
  }

  async filterUsedAddresses(
    addresses: Array<BechAddress>,
  ): Promise<Set<BechAddress>> {
    const usedAddresses: {address: HexAddress; firstSlot: number}[] =
      await fetch(`${this.url}/filterUsedAddresses`, {
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
    const res = await fetch(`${this.url}/protocolParameters`).then((res) =>
      res.json(),
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
