import type {JsAPI} from '@wingriders/cab/dappConnector'

export const getWalletOwner = async (jsApi: JsAPI) => {
  const ownerAddress =
    (await jsApi.getUsedAddresses())?.[0] ??
    (await jsApi.getUnusedAddresses())[0]

  if (!ownerAddress) {
    throw new Error('No address found for wallet')
  }

  return ownerAddress
}
