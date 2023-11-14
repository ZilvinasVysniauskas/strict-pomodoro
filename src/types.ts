export enum TimerActions {
  StartTimer = 'StartTimer',
  PauseTimer = 'PauseTimer',
  ResetTimer = 'ResetTimer',
}

export enum MessageTypes {
  TimerStatus = 'TimerStatus',
  CountUpdate = 'CountUpdate',
  CloseActiveTab = 'CloseTab',
  GetTimeLeft = 'GetTimerLeft'
}

export interface ChromeMessage {
  type: MessageTypes
  body?: any
}

export enum TimerStatus {
  Active = 'Active',
  NotActive = 'NotActive'
}
