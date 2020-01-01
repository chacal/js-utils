declare module 'coap' {
  import { Writable } from 'stream'

  export interface IncomingMessage {
    payload: Buffer
  }

  export interface OutgoingMessage extends Writable {
    setOption(name: string, value: string): void
  }

  export interface RequestParams {
    hostname: string,
    method: string,
    pathname: string,
    query: string,
    confirmable: boolean
  }

  export interface TimingParams {
    ackTimeout?: number // seconds
    ackRandomFactor?: number
    maxRetransmit?: number

    // MAX_LATENCY is the maximum time a datagram is expected to take
    // from the start of its transmission to the completion of its
    // reception.
    maxLatency?: number // seconds

    piggybackReplyMs?: number

    // default coap port
    coapPort?: number

    // default max packet size
    maxPacketSize?: number

    // true: always send CoAP ACK messages, even for non confirmable packets
    // false: only send CoAP ACK messages for confirmable packets
    sendAcksForNonConfirmablePackets?: boolean
  }


  export function request(url: RequestParams | string): OutgoingMessage

  export function updateTiming(params: TimingParams): void
}