import {cacheResults} from '@wingriders/cab/helpers'
import {CabBackendExplorer} from '@wingriders/wallet-common'

const PROTOCOL_PARAMETERS_CACHE_TTL = 1000 * 60 * 60 // 1 hour

const fetchProtocolParameters = async () => {
  const cabBackendExplorer = new CabBackendExplorer('http://127.0.0.1:3000')
  return cabBackendExplorer.getProtocolParameters()
}

export const getCachedProtocolParameters = cacheResults(
  PROTOCOL_PARAMETERS_CACHE_TTL,
)(fetchProtocolParameters)
