import { parse } from 'url'
import Bacon = require('baconjs')
import { SensorEvents } from './ISensorEvent'
import { Coap } from './Coap'
import IThreadParentInfo = SensorEvents.IThreadParentInfo

export namespace NetworkDisplay {

  type DisplayTag = 'd'
  export type DisplayStatus = { instance: string, tag: DisplayTag, vcc: number, ts: string, parent: IThreadParentInfo }
  export type StatusStream = Bacon.EventStream<any, DisplayStatus>

  export function statusesWithInterval(displayAddress: string, intervalMs: number): StatusStream {
    return Bacon.once('').concat(Bacon.interval(intervalMs, ''))
      .flatMapLatest(() => Bacon.fromPromise(Coap.getJson(parse(`coap://[${displayAddress}]/api/status`))))
      .map(res => JSON.parse(res.payload.toString()))
      .map(ds => ({
        instance: ds.instance,
        tag: 'd' as DisplayTag,
        vcc: ds.vcc,
        ts: new Date().toISOString(),
        parent: ds.parent
      }))
  }

}

