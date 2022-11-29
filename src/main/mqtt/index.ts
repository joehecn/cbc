import Client from './Client';
import { Task } from '../../util/config';

import OtaClient from './OtaClient';

/* Client */
export const taskStep1 = (task: Task) => {
  const { taskID, source } = task;

  const client = new Client('source', source, task);

  Client.sourceClientMap[taskID] = client;
};

export const destorySourceClient = (task: Task, needEmit = false) => {
  const { taskID } = task;

  if (Client.sourceClientMap[taskID]) {
    const client = Client.sourceClientMap[taskID];
    client.destory(task, needEmit);
    delete Client.sourceClientMap[taskID];
  }
};

export const taskStep2 = (task: Task) => {
  const { taskID, target, deviceID, link } = task;

  new Client('target', target, task);

  // 发送升级指令
  const sourceClient = Client.sourceClientMap[taskID];
  sourceClient.pub(`${deviceID}/ota/cmd`, JSON.stringify({ link }));
};

/* Ota Client */

const otaClientMap: any = {};

export const initOtaClient = (platform: string) => {
  if (!otaClientMap[platform]) {
    otaClientMap[platform] = new OtaClient(platform);
  }
};

export const sendOtaMsg = (platform: string, topic: string, payload: string) => {
  if (otaClientMap[platform]) {
    otaClientMap[platform].pub(topic, payload);
  }
};

export const destoryOtaClient = (platform: string) => {
  if (otaClientMap[platform]) {
    otaClientMap[platform].destory();
    delete otaClientMap[platform];
  }
};
