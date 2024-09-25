import {cacheResults, makeNonNullable} from '@wingriders/cab/helpers'
import {parseOgmiosProtocolParameters} from './parse'

const PROTOCOL_PARAMETERS_CACHE_TTL = 1000 * 60 * 60 // 1 hour

const fetchProtocolParameters = async () => {
  const res = await fetch('http://127.0.0.1:3000/protocolParameters').then(
    (res) => res.json(),
  )
  return makeNonNullable(parseOgmiosProtocolParameters(res))
}

export const getCachedProtocolParameters = cacheResults(
  PROTOCOL_PARAMETERS_CACHE_TTL,
)(fetchProtocolParameters)
