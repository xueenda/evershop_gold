const http = require('http');
const { Handler } = require('@evershop/evershop/src/lib/middleware/Handler');
const spawn = require('cross-spawn');
const path = require('path');
const { error } = require('@evershop/evershop/src/lib/log/debuger');
const isDevelopmentMode = require('@evershop/evershop/src/lib/util/isDevelopmentMode');
const { lockHooks } = require('@evershop/evershop/src/lib/util/hookable');
const { lockRegistry } = require('@evershop/evershop/src/lib/util/registry');
const { createApp } = require('./app');
const normalizePort = require('./normalizePort');
const onListening = require('./onListening');
const onError = require('./onError');
const { getCoreModules } = require('./loadModules');
const { migrate } = require('./bootstrap/migrate');
const { loadBootstrapScript } = require('./bootstrap/bootstrap');
const { getEnabledExtensions } = require('../extension');
const socketIO = require('socket.io');

let app = createApp();
/** Create a http server */
const server = http.createServer(app);

const io = socketIO(server, {
  path: '/websocket' // Set the path to '/websocket'
});

// Handle Socket.IO connections
io.on('connection', (socket) => {
  console.log('A user connected');

  // Example event handler
  socket.on('getGoldPrice', (msg) => {
    console.log('message: ' + msg);
    io.emit('price', msg);
  });


  // Disconnect event handler
  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

setInterval(()=>{
  const price =(Math.random() * 101 + 2000).toFixed(2);
  io.emit('price', { goldBar: price });
}, 1000 * 3)

module.exports.start = async function start(cb) {
  const modules = [...getCoreModules(), ...getEnabledExtensions()];

  /** Migration */
  try {
    await migrate(modules);
  } catch (e) {
    error(e);
    process.exit(0);
  }

  /** Loading bootstrap script from modules */
  try {
    // eslint-disable-next-line no-restricted-syntax
    for (const module of modules) {
      await loadBootstrapScript(module);
    }
    lockHooks();
    lockRegistry();
  } catch (e) {
    error(e);
    process.exit(0);
  }
  process.env.ALLOW_CONFIG_MUTATIONS = false;
  /**
   * Get port from environment and store in Express.
   */
  const port = normalizePort();
  app.set('port', port);

  /** Start listening */
  server.on('listening', () => {
    onListening();
    if (cb) {
      cb();
    }
  });
  server.on('error', onError);
  server.listen(port);

  // Spawn the child process to manage events
  const args = [
    path.resolve(__dirname, '../../src/lib/event/event-manager.js')
  ];
  if (isDevelopmentMode() || process.argv.includes('--debug')) {
    args.push('--debug');
  }
  const child = spawn('node', args, {
    stdio: 'inherit',
    env: {
      ...process.env,
      ALLOW_CONFIG_MUTATIONS: true
    }
  });

  child.on('error', (err) => {
    error(`Error spawning event processor: ${err}`);
  });

  child.unref();
};

module.exports.updateApp = function updateApp(cb) {
  /** Clean up middleware */
  Handler.middlewares = [];
  const newApp = createApp();
  server.removeListener('request', app);
  server.on('request', newApp);
  app = newApp;
  cb();
};
