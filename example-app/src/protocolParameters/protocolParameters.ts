import {cacheResults} from '@wingriders/cab/helpers'
import {CabBackendExplorer} from '@wingriders/wallet-common'
import {config} from '../config'

const PROTOCOL_PARAMETERS_CACHE_TTL = 1000 * 60 * 60 // 1 hour

const fetchProtocolParameters = async () => {
  const cabBackendExplorer = new CabBackendExplorer(
    config.CAB_SERVER_URL_PREPROD,
  )
  return cabBackendExplorer.getProtocolParameters()
}

export const getCachedProtocolParameters = cacheResults(
  PROTOCOL_PARAMETERS_CACHE_TTL,
)(fetchProtocolParameters)
