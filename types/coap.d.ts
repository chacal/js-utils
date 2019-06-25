declare module 'coap' {
  import { Writable } from 'stream'

  interface IncomingMessage {
    payload: Buffer
  }

  interface OutgoingMessage extends Writable {
    setOption(name: string, value: string): void
  }

  interface RequestParams {
    hostname: string,
    method: string,
    pathname: string,
    query: string,
    confirmable: boolean
  }

  export function request(url: RequestParams | string): OutgoingMessage
}