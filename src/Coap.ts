import coap = require('coap')
import { Url } from 'url'
import { IncomingMessage, OutgoingMessage, TimingParams, updateTiming as coapUpdateTiming } from 'coap'

export namespace Coap {
  export function getJson(url: Url): Promise<IncomingMessage> {
    return new Promise((resolve, reject) => {
      const req = coap.request(url.href)
      req.setOption('Accept', 'application/json')
      sendAndHandleResponse(req, resolve, reject)
    })
  }

  export function postJson(url: Url, payload: Object, confirmable: boolean = true): Promise<IncomingMessage> {
    return postData(url, JSON.stringify(payload), 'application/json', confirmable)
  }

  export function postOctetStream(url: Url, payload: Buffer, confirmable: boolean = true): Promise<IncomingMessage> {
    return postData(url, payload, 'application/octet-stream', confirmable)
  }

  export function updateTiming(params: TimingParams) {
    coapUpdateTiming(params)
  }

  function postData(url: Url, data: any, contentFormat: string, confirmable: boolean = true): Promise<IncomingMessage> {
    return new Promise((resolve, reject) => {
      const req = coap.request({
        hostname: url.hostname,
        method: 'POST',
        pathname: url.pathname,
        query: url.query ? url.query.toString() : '',
        confirmable
      })
      req.setOption('Content-Format', contentFormat)
      req.write(data)
      sendAndHandleResponse(req, resolve, reject)
    })
  }

  function sendAndHandleResponse(request: OutgoingMessage, resolve: (value?: any) => void, reject: (reason?: any) => void) {
    request.on('response', res => res.code.startsWith('2.') ? resolve(res) : reject(res))
    request.on('timeout', err => reject(err))
    request.on('error', err => reject(err))
    request.end()
  }
}

