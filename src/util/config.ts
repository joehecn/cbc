export { __J_MAIN__ } from './__J_MAIN__.json';
export { __MAIN_MSG__ } from './__MAIN_MSG__.json';
export { __RENDERER_MSG__ } from './__RENDERER_MSG__.json';

export type OtaListRow = {
  id: string;
  version: string;
  state: STATE_ENUM;
  life?: LIFE_ENUM;
};

export type Task = {
  taskID: string;
  deviceID: string;
  life: LIFE_ENUM;
  source: string;
  sourceState: STATE_ENUM;
  target: string;
  targetState: STATE_ENUM;
  link: string;
  sourceOnlineMsgCount: number;
};

export type TP = {
  topic: string;
  payloadStr: string;
};

export type MqttMsg = {
  platform: string;
  topic: string;
  payloadStr: string;
};

export type Msg<T> = {
  key: string;
  value: T;
};

export enum LIFE_ENUM {
  RUNNING,
  END
}

export enum STATE_ENUM {
  UNKNOWN,
  ONLINE,
  OFFLINE,
  DOWNLOADING, // source
  UPDATE_FAIL, // source
  UPDATE_COMPLETE, // target
  CANCEL // source
}
