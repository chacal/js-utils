import mqtt = require('mqtt')
import Bacon = require('baconjs')

declare module 'baconjs' {
  function fromEvent<E, A>(target: EventTarget|NodeJS.EventEmitter|JQuery, eventName: string, eventTransformer: (t: string, m: Buffer) => A): Bacon.EventStream<E, A>;
}

export namespace Mqtt {

  const MAX_DISCONNECT_COUNT = 20

  export function startMqttClient<A>(brokerUrl: string, username?: string, password?: string): mqtt.Client {
    let disconnectCount = 0

    const client = mqtt.connect(brokerUrl, {username, password})
    client.on('connect', () => console.log(`Connected to MQTT server ${brokerUrl}`))
    client.on('offline', () => {
      disconnectCount++
      console.log(`Disconnected from MQTT server. Disconnect count: ${disconnectCount}/${MAX_DISCONNECT_COUNT}`)
      if(disconnectCount === MAX_DISCONNECT_COUNT) {
        console.log("Exiting due to too many MQTT disconnects..")
        process.exit(1)
      }
    })
    client.on('error', (e) => console.log('MQTT client error', e))

    return client
  }

  export function messageStreamFrom<E>(mqttClient: mqtt.Client): Bacon.EventStream<E, Buffer> {
    return Bacon.fromEvent(mqttClient, 'message', (topic, msg) => msg)
  }
}
