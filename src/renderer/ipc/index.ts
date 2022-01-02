/** @type {import('electron').IpcRenderer} */
import { __J_MAIN__ } from '../../util/config';

const { ipc } = (window as { [key: string]: any })[__J_MAIN__];

export default ipc;
