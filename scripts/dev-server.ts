process.env.NODE_ENV = 'development';

import * as vite from 'vite';
import * as childProcess from 'child_process';
import * as path from 'path';
import * as chalk from 'chalk';
import * as chokidar from 'chokidar';

let electronProcess = null;

async function startRenderer() {
  const config = require(path.join(__dirname, '..', 'tsconfig.renderer.json'));

  const server = await vite.createServer({
    ...config,
    mode: 'development'
  });

  return server.listen();
}

function startElectron(rendererPort) {
  if (electronProcess) {
    // single instance lock
    return;
  }

  const args = [path.join(__dirname, 'main.js'), rendererPort];

  electronProcess = childProcess.spawn('electron', args);

  electronProcess.stdout.on('data', (data) => {
    console.log(chalk.blueBright(`[Electron] `) + chalk.white(data.toString()));
  });

  electronProcess.stderr.on('data', (data) => {
    console.log(chalk.redBright(`[Electron] `) + chalk.white(data.toString()));
  });
}

function restartElectron(rendererPort) {
  if (electronProcess) {
    electronProcess.kill();
    electronProcess = null;
  }

  startElectron(rendererPort);
}

async function start() {
  console.log(`${chalk.blueBright('===============================')}`);
  console.log(`${chalk.blueBright('Starting Electron + Vite Dev Server...')}`);
  console.log(`${chalk.blueBright('===============================')}`);

  const devServer = await startRenderer();
  const rendererPort = devServer.config.server.port;

  startElectron(rendererPort);

  chokidar.watch(path.join(__dirname, '..', 'src', 'main')).on('change', () => {
    restartElectron(rendererPort);
  });
}

start();
