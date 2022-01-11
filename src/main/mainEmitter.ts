import { EventEmitter } from 'events';

class MainEmitter extends EventEmitter {}

const mainEmitter = new MainEmitter();

export default mainEmitter;
