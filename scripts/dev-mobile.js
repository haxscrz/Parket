#!/usr/bin/env node
const { createServer } = require('vite');
const { spawn } = require('child_process');
const fs = require('fs');
const http = require('http');

function isUrlAlive(url, timeout = 1000) {
  return new Promise((resolve) => {
    const req = http.get(url, () => {
      req.destroy();
      resolve(true);
    });
    req.on('error', () => resolve(false));
    req.setTimeout(timeout, () => {
      req.destroy();
      resolve(false);
    });
  });
}

function openUrlMobile(url) {
  const chromePaths = [
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe'
  ];

  let chromeFound = null;
  for (const p of chromePaths) {
    try {
      fs.accessSync(p);
      chromeFound = p;
      break;
    } catch (e) {
      // not found
    }
  }

  const mobileUserAgent = 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.0 Mobile/15E148 Safari/604.1';

  if (chromeFound) {
    const args = [
      `--app=${url}`,
      '--window-size=390,844',
      '--user-agent=' + mobileUserAgent,
      '--hide-scrollbars'
    ];
    console.log('Opening Chrome in mobile app window...');
    spawn(chromeFound, args, { detached: true, stdio: 'ignore' }).unref();
    return;
  }

  // Fallback: use platform-specific open
  if (process.platform === 'win32') {
    spawn('cmd', ['/c', 'start', '""', url], { detached: true, stdio: 'ignore' }).unref();
  } else if (process.platform === 'darwin') {
    spawn('open', [url], { detached: true, stdio: 'ignore' }).unref();
  } else {
    spawn('xdg-open', [url], { detached: true, stdio: 'ignore' }).unref();
  }
}

async function start() {
  // default host/port from your vite config
  const defaultHost = 'localhost';
  const defaultPort = 3000;
  const url = `http://${defaultHost}:${defaultPort}/`;

  // If server already running, just open the browser and exit
  const alive = await isUrlAlive(url);
  if (alive) {
    console.log(`Detected existing dev server at ${url} — opening mobile browser window.`);
    openUrlMobile(url);
    return;
  }

  // Start Vite programmatically
  const server = await createServer({});
  await server.listen();

  // Determine effective host/port
  const info = server.config && server.config.server ? server.config.server : {};
  const port = info.port || defaultPort;
  const host = info.host || defaultHost;
  const finalUrl = `http://${host}:${port}/`;

  console.log(`Vite server running at ${finalUrl}`);
  openUrlMobile(finalUrl);
}

start().catch(err => {
  console.error(err);
  process.exit(1);
});
