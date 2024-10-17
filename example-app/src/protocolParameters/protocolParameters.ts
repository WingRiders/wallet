import {cacheResults} from '@wingriders/cab/helpers'
import type {NetworkName} from '@wingriders/cab/types'
import {CabBackendExplorer} from '@wingriders/wallet-common'
import {cabServerUrlByNetwork} from '../config'

const PROTOCOL_PARAMETERS_CACHE_TTL = 1000 * 60 * 60 // 1 hour

const fetchProtocolParameters = async (network: NetworkName) => {
  const cabBackendExplorer = new CabBackendExplorer({
    url: cabServerUrlByNetwork[network],
    network,
  })
  return cabBackendExplorer.getProtocolParameters()
}

export const getCachedProtocolParameters = cacheResults(
  PROTOCOL_PARAMETERS_CACHE_TTL,
)(fetchProtocolParameters)
