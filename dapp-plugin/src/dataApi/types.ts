import type {CborHexString, HexString} from '@wingriders/cab/dappConnector'
import type {Address, UTxO} from '@wingriders/cab/types'

/**
 * Models the API for data that the wallet plugin needs to fetch outside of the wallet gateway.
 */
export type IDataApi = {
  getUtxos(addresses: Address[]): Promise<UTxO[]>
  submitTx(tx: CborHexString): Promise<HexString>
}
