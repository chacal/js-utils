export namespace SensorEvents {
//
// Interfaces
//
  export interface ISensorEventBase {
    readonly instance: string,
    readonly tag: string,
    readonly ts: string,
    readonly vcc?: number,
    readonly previousSampleTimeMicros?: number
  }

  export interface ITemperatureEvent extends ISensorEventBase {
    readonly temperature: number
  }

  export interface IPressureEvent extends ISensorEventBase {
    readonly pressure: number
  }

  export interface IHumidityEvent extends ISensorEventBase {
    readonly humidity: number
  }

  export interface ICurrentEvent extends ISensorEventBase {
    readonly current: number
  }

  export interface ITankLevel extends ISensorEventBase {
    readonly tankLevel: number
  }

  export interface IElectricEnergyEvent extends ISensorEventBase {
    readonly ampHours: number
  }

  export interface ILevelReportEvent extends ISensorEventBase {
    readonly level: number
  }

  export interface IAutopilotCommand extends ISensorEventBase {
    readonly buttonId: number
    readonly isLongPress: boolean
  }

  export interface IAutopilotState extends ISensorEventBase {
    readonly enabled: boolean
    readonly course: number
  }

  export type ISensorEvent = ITemperatureEvent | IPressureEvent | IHumidityEvent | ICurrentEvent | ITankLevel | IElectricEnergyEvent | ILevelReportEvent | IAutopilotCommand | IAutopilotState



//
// Type guards
//
  export function isTemperature(event: ISensorEvent): event is ITemperatureEvent {
    return (<ITemperatureEvent>event).tag === 't';
  }

  export function isPressure(event: ISensorEvent): event is IPressureEvent {
    return (<IPressureEvent>event).tag === 'p';
  }

  export function isHumidity(event: ISensorEvent): event is IHumidityEvent {
    return (<IHumidityEvent>event).tag === 'h';
  }

  export function isCurrent(event: ISensorEvent): event is ICurrentEvent {
    return (<ICurrentEvent>event).tag === 'c';
  }

  export function isTankLevel(event: ISensorEvent): event is ITankLevel {
    return (<ITankLevel>event).tag === 'w';
  }

  export function isElectricEnergy(event: ISensorEvent): event is IElectricEnergyEvent {
    return (<IElectricEnergyEvent>event).tag === 'e';
  }

  export function isLevelReport(event: ISensorEvent): event is ILevelReportEvent {
    return (<ILevelReportEvent>event).tag === 'r';
  }

  export function isAutopilotCommand(event: ISensorEvent): event is IAutopilotCommand {
    return (<IAutopilotCommand>event).tag === 'a';
  }

  export function isAutopilotState(event: ISensorEvent): event is IAutopilotState {
    return (<IAutopilotState>event).tag === 'b';
  }
}
