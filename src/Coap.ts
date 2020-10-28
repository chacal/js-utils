import coap = require('coap')
import { Url } from 'url'
import { IncomingMessage, OutgoingMessage, RequestParams, TimingParams, updateTiming as coapUpdateTiming } from 'coap'

const MAX_COAP_PAYLOAD_SIZE = 1170
const BLOCK1_BLOCK_SIZE = 1024
const BLOCK1_SIZE_EXPONENT = 6  // Block size == 2^(4 + size exponent)

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


  function postData(url: Url, data: Buffer | string, contentFormat: string, confirmable: boolean = true): Promise<IncomingMessage> {
    const reqOpts = {
      hostname: url.hostname,
      method: 'POST',
      pathname: url.pathname,
      query: url.query ? url.query.toString() : '',
      confirmable
    }

    if (data.length > MAX_COAP_PAYLOAD_SIZE) {
      return sendBlock1Request(reqOpts, contentFormat, Buffer.from(data))
    } else {
      return new Promise((resolve, reject) => {
        const req = coap.request(reqOpts)
        req.setOption('Content-Format', contentFormat)
        req.write(data)
        sendAndHandleResponse(req, resolve, reject)
      })
    }
  }

  function sendAndHandleResponse(request: OutgoingMessage, resolve: (value?: any) => void, reject: (reason?: any) => void) {
    request.on('response', res => res.code.startsWith('2.') ? resolve(res) : reject(res))
    request.on('timeout', err => reject(err))
    request.on('error', err => reject(err))
    request.end()
  }

  interface Block1Block {
    block1Option: number,
    data: Buffer
  }

  function encodeBlock1Option(blockNum: number, more: boolean, sizeExponent: number) {
    /*
     * Encode Block1 option:
     *  bits n-4: block number
     *       3:   more blocks coming
     *       2-0: size exponent
     */
    return (blockNum << 4) | ((more ? 1 : 0) << 3) | sizeExponent
  }

  function createBlocks(data: Buffer): Block1Block[] {
    const blocks: Array<Block1Block> = []

    while (data.length > BLOCK1_BLOCK_SIZE) {
      blocks.push({
        block1Option: encodeBlock1Option(blocks.length, true, BLOCK1_SIZE_EXPONENT),
        data: data.slice(0, BLOCK1_BLOCK_SIZE)
      })
      data = data.slice(BLOCK1_BLOCK_SIZE)
    }
    blocks.push({
      block1Option: encodeBlock1Option(blocks.length, false, BLOCK1_SIZE_EXPONENT),
      data: data
    })

    return blocks
  }

  function createBlock1Request(opts: RequestParams, contentFormat: string, block: Block1Block) {
    const req = coap.request(opts)
    req.setOption('Content-Format', contentFormat)
    req.setOption('Block1', Buffer.from([block.block1Option]))
    req.write(block.data)
    return req
  }

  function sendBlock1Request(reqOpts: RequestParams, contentFormat: string, data: Buffer): Promise<IncomingMessage> {
    return new Promise((resolve, reject) => {
      const blocks = createBlocks(data)
      sendFirstBlock(blocks)

      function sendFirstBlock(blocks: Block1Block[]) {
        if (blocks.length === 0) {
          reject(new Error('All blocks already sent!'))
        }

        const req = createBlock1Request(reqOpts, contentFormat, blocks[0])
        sendAndHandleResponse(req, (res) => {
          if (res.code == '2.31') {
            sendFirstBlock(blocks.slice(1))
          } else if (res.code == '2.01' || res.code == '2.04') {
            resolve(res)
          } else {
            reject(res)
          }
        }, reject)
      }
    })
  }
}
