import {encodeTxScript} from '@wingriders/cab/ledger/transaction'
import type {TxScript} from '@wingriders/cab/types'
import {Tagged} from 'borc'

export class CborizedTxScriptRef {
  script: TxScript
  constructor(script: TxScript) {
    this.script = script
  }

  encodeCBOR(encoder: any) {
    return encoder.pushAny(new Tagged(24, encodeTxScript(this.script), null))
  }
}
