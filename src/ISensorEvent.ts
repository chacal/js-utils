export namespace SensorEvents {
//
// Interfaces
//
  type Tag = 't' | 'p' | 'h' | 'm' | 'c' | 'w' | 'e' | 'r' | 'a' | 'b' | 'k' | 'd' | 'i'

  export interface ISensorEventBase {
    readonly instance: string,
    readonly tag: Tag,
    readonly ts: string,
    readonly vcc?: number,
    readonly previousSampleTimeMicros?: number
    readonly rssi?: number
  }

  export interface ITemperatureEvent extends ISensorEventBase {
    tag: 't'
    readonly temperature: number
  }

  export interface IPressureEvent extends ISensorEventBase {
    tag: 'p'
    readonly pressure: number
  }

  export interface IHumidityEvent extends ISensorEventBase {
    tag: 'h'
    readonly humidity: number
  }

  export interface IEnvironmentEvent extends ISensorEventBase {
    tag: 'm'
    readonly temperature: number
    readonly pressure: number
    readonly humidity: number
  }

  export interface ICurrentEvent extends ISensorEventBase {
    tag: 'c'
    readonly current: number
    readonly messageCounter: number
  }

  export interface ITankLevel extends ISensorEventBase {
    tag: 'w'
    readonly tankLevel: number
  }

  export interface IElectricEnergyEvent extends ISensorEventBase {
    tag: 'e'
    readonly ampHours: number
  }

  export interface ILevelReportEvent extends ISensorEventBase {
    tag: 'r'
    readonly level: number
  }

  export interface IAutopilotCommand extends ISensorEventBase {
    tag: 'a'
    readonly buttonId: number
    readonly isLongPress: boolean
    readonly messageCounter: number
  }

  export interface IAutopilotState extends ISensorEventBase {
    tag: 'b'
    readonly enabled: boolean
    readonly course: number
  }

  export interface IPirEvent extends ISensorEventBase {
    tag: 'k'
    readonly motionDetected: boolean
    readonly messageId: number
  }

  export interface IThreadParentInfo {
    readonly rloc16: string,
    readonly linkQualityIn: number,
    readonly linkQualityOut: number,
    readonly avgRssi: number,
    readonly latestRssi: number
  }

  export interface IThreadDisplayStatus extends ISensorEventBase {
    tag: 'd'
    readonly vcc: number
    readonly parent: IThreadParentInfo
  }

  export interface IImpulseEvent extends ISensorEventBase {
    tag: 'i'
  }

  export type ISensorEvent =
    ITemperatureEvent | IPressureEvent | IHumidityEvent | IEnvironmentEvent | ICurrentEvent | ITankLevel |
    IElectricEnergyEvent | ILevelReportEvent | IAutopilotCommand | IAutopilotState |
    IPirEvent | IThreadDisplayStatus | IImpulseEvent


//
// Type guards
//
  export function isTemperature(event: ISensorEvent): event is ITemperatureEvent {
    return (<ITemperatureEvent>event).tag === 't'
  }

  export function isPressure(event: ISensorEvent): event is IPressureEvent {
    return (<IPressureEvent>event).tag === 'p'
  }

  export function isHumidity(event: ISensorEvent): event is IHumidityEvent {
    return (<IHumidityEvent>event).tag === 'h'
  }

  export function isEnvironment(event: ISensorEvent): event is IEnvironmentEvent {
    return (<IEnvironmentEvent>event).tag === 'm'
  }

  export function isCurrent(event: ISensorEvent): event is ICurrentEvent {
    return (<ICurrentEvent>event).tag === 'c'
  }

  export function isTankLevel(event: ISensorEvent): event is ITankLevel {
    return (<ITankLevel>event).tag === 'w'
  }

  export function isElectricEnergy(event: ISensorEvent): event is IElectricEnergyEvent {
    return (<IElectricEnergyEvent>event).tag === 'e'
  }

  export function isLevelReport(event: ISensorEvent): event is ILevelReportEvent {
    return (<ILevelReportEvent>event).tag === 'r'
  }

  export function isAutopilotCommand(event: ISensorEvent): event is IAutopilotCommand {
    return (<IAutopilotCommand>event).tag === 'a'
  }

  export function isAutopilotState(event: ISensorEvent): event is IAutopilotState {
    return (<IAutopilotState>event).tag === 'b'
  }

  export function isPirEvent(event: ISensorEvent): event is IPirEvent {
    return (<IPirEvent>event).tag === 'k'
  }

  export function isThreadDisplayStatus(event: ISensorEvent): event is IThreadDisplayStatus {
    return (<IThreadDisplayStatus>event).tag === 'd'
  }

  export function isImpulseEvent(event: ISensorEvent): event is IImpulseEvent {
    return (<IImpulseEvent>event).tag === 'i'
  }
}
