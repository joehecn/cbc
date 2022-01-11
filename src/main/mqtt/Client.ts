import { connect, MqttClient } from 'mqtt';
import mainEmitter from '../mainEmitter';
import { Task, Msg, STATE_ENUM, LIFE_ENUM } from '../../util/config';

const brokerUrlMap: { [key: string]: string } = {
  '2.0 sandbox': 'tcp://fusquare-hardwaremqtt.cloud-building.fun:1883',
  '2.0 product': 'tcp://fusquare-hardwaremqtt.cloud-building.com:1883',
  '3.0 sandbox': 'tcp://cbosv3-sandbox.cloud-building.com:1883',
  '3.0 product': 'tcp://cbosv3.cloud-building.com:1883'
};

export default class Client {
  static sourceClientMap: { [key: string]: Client } = {};

  task: Task;
  platformType: string;

  broker: string;
  client: MqttClient;

  topicInfo: string;
  topicSta: string;

  deviceID: string;

  constructor(platformType: string, platform: string, task: Task) {
    const { deviceID } = task;

    this.task = task;
    this.platformType = platformType;
    this.broker = brokerUrlMap[platform];

    this.client = connect(this.broker, {
      username: 'fusquare-server',
      password: 'Dad6E_a13_3c'
    });

    this.client.on('message', this.handleMessage.bind(this));

    this.client.on('connect', () => {
      this.topicInfo = `${deviceID}/info`;
      this.topicSta = `${deviceID}/ota/sta`;

      this.sub(this.topicInfo);
      this.sub(this.topicSta);
    });

    this.deviceID = deviceID;
  }

  handleMessage(topic: string, payloadBuf: Buffer) {
    const platformType = this.platformType;
    console.log('------- handleMessage from:', platformType);

    const payloadStr = payloadBuf.toString();
    const payload = JSON.parse(payloadStr);
    console.log({ topic, payload });

    if (platformType === 'source') {
      if (topic === this.topicInfo) {
        const payloadState = payload.state;

        if (payloadState === 'ONLINE') {
          this.task.sourceState = STATE_ENUM.ONLINE;
          this.task.sourceOnlineMsgCount++;
        } else if (payloadState === 'OFFLINE') {
          if (this.task.sourceOnlineMsgCount === 0) {
            this.unsub(topic);
            this.task.life = LIFE_ENUM.END;
            this.destory(this.task);
          }
          this.task.sourceState = STATE_ENUM.OFFLINE;
        }
      } else if (topic === this.topicSta) {
        const payloadSta = payload.sta;

        if (payloadSta === 201) {
          this.task.sourceState = STATE_ENUM.DOWNLOADING;
        } else if (payloadSta === 204) {
          this.unsub(topic);

          this.task.sourceState = STATE_ENUM.UPDATE_FAIL;
          this.task.life = LIFE_ENUM.END;

          this.destory(this.task);
        }
      }
    } else if (platformType === 'target') {
      if (topic === this.topicInfo) {
        const payloadState = payload.state;

        if (payloadState === 'ONLINE') {
          this.unsub(topic);

          this.task.targetState = STATE_ENUM.ONLINE;
        } else if (payloadState === 'OFFLINE') {
          this.task.targetState = STATE_ENUM.OFFLINE;
        }
      } else if (topic === this.topicSta) {
        this.unsub(topic);

        const payloadSta = payload.sta;

        if (payloadSta === 203) {
          this.task.targetState = STATE_ENUM.UPDATE_COMPLETE;
          this.task.life = LIFE_ENUM.END;
        }

        this.destory(this.task);
      }
    }

    const msg: Msg<Task> = {
      key: platformType,
      value: this.task
    };
    mainEmitter.emit('mqtt-handle-msg', msg);
  }

  sub(topic: string) {
    this.client.subscribe(topic);
  }

  removeMessageIdToTopic(client: any, targetMqttTopic: string) {
    // https://github.com/mqttjs/MQTT.js/issues/1117
    const topics = client.messageIdToTopic;
    const topicExits = Object.keys(topics).find((k) => String(topics[k]) === targetMqttTopic);
    if (topicExits !== undefined) {
      client.unsubscribe(targetMqttTopic);
      delete client.messageIdToTopic[topicExits];
    }
  }
  unsub(topic: string) {
    this.removeMessageIdToTopic(this.client as any, topic);
  }

  pub(topic: string, payload: string) {
    // console.log('pub to:', this.broker);
    // console.log({ topic, payload });
    this.client.publish(topic, payload);
  }

  destory(task: Task, needEmit = false) {
    this.client.end(true);

    if (needEmit) {
      const msg: Msg<Task> = {
        key: 'destory',
        value: task
      };
      mainEmitter.emit('mqtt-handle-msg', msg);
    }
  }
}
