import { connect, MqttClient } from 'mqtt';
import mainEmitter from '../mainEmitter';
import { TP, Msg } from '../../util/config';

const brokerUrlMap: { [key: string]: string } = {
  '3.0 sandbox': 'tcp://cbosv3-sandbox.cloud-building.com:1883',
  '3.0 product': 'tcp://cbosv3.cloud-building.com:1883'
};

export default class OtaClient {
  broker: string;
  client: MqttClient;

  topicInfo = '+/info';
  topicSta = '+/ota/sta';

  constructor(platform: string) {
    // console.log('------- OtaClient.constructor:', platform);
    this.broker = brokerUrlMap[platform];

    this.client = connect(this.broker, {
      username: 'fusquare-server',
      password: 'Dad6E_a13_3c'
    });

    this.client.on('message', this.handleMessage.bind(this));

    this.client.on('connect', () => {
      // console.log('------- OtaClient.onConnect');
      this.sub(this.topicInfo);
      this.sub(this.topicSta);
    });
  }

  handleMessage(topic: string, payloadBuf: Buffer) {
    // 过滤
    if (!topic.startsWith('T')) return;

    // console.log('------- OtaClient.handleMessage');
    const payloadStr = payloadBuf.toString();
    // console.log({ topic, payloadStr });

    // {
    //   topic: 'T00000000018/info',
    //   payloadStr: '{\n' +
    //     '\t"state":\t"ONLINE",\n' +
    //     '\t"version":\t"TEREO_HW_1.0",\n' +
    //     '\t"firmware":\t"TEREO_FW_1.1.1",\n' +
    //     '\t"mac":\t"f0:08:d1:d7:a5:3a",\n' +
    //     '\t"profileCustomID":\t"mega-tereo-liftcall-01"\n' +
    //     '}'
    // }
    // {
    //   topic: 'T00000000018/info',
    //   payloadStr: '{\n' +
    //     '\t"state":\t"ONLINE",\n' +
    //     '\t"version":\t"TEREO_HW_1.0",\n' +
    //     '\t"firmware":\t"TEREO_FW_1.1.1",\n' +
    //     '\t"mac":\t"f0:08:d1:d7:a5:3a",\n' +
    //     '\t"profileCustomID":\t"mega-tereo-liftcall-01"\n' +
    //     '}'
    // }

    const msg: Msg<TP> = {
      key: 'ota-client-handle-msg',
      value: {
        topic,
        payloadStr
      }
    };
    mainEmitter.emit('ota-client-handle-msg', msg);
  }

  sub(topic: string) {
    this.client.subscribe(topic);
  }

  pub(topic: string, payload: string) {
    console.log({ topic, payload });
    this.client.publish(topic, payload);
  }

  destory() {
    // console.log('------- OtaClient.destory');
    this.client.end(true);

    const msg: Msg<string> = {
      key: 'destory',
      value: ''
    };
    mainEmitter.emit('ota-client-handle-msg', msg);
  }
}
