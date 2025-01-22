import {NetworkName} from '@wingriders/cab/types'

interface IExplorerLinks {
  address: (address: string) => string
}

export class CardanoscanLinks implements IExplorerLinks {
  private baseUrl: string

  constructor(network: NetworkName) {
    this.baseUrl = {
      [NetworkName.MAINNET]: 'https://cardanoscan.io',
      [NetworkName.PREPROD]: 'https://preprod.cardanoscan.io',
    }[network]
  }

  address(address: string): string {
    return `${this.baseUrl}/address/${address}`
  }
}
