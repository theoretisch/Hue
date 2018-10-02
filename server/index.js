const serverStart = new Date();
const dateString = serverStart.getFullYear() + "-" + (
  serverStart.getMonth() < 10
  ? "0"
  : "") + serverStart.getMonth() + "-" + (
  serverStart.getDate() < 10
  ? "0"
  : "") + serverStart.getDate();
const timeString = (
  serverStart.getHours() < 10
  ? "0"
  : "") + serverStart.getHours() + ":" + (
  serverStart.getMinutes() < 10
  ? "0"
  : "") + serverStart.getMinutes() + ":" + (
  serverStart.getSeconds() < 10
  ? "0"
  : "") + serverStart.getSeconds() + "." + (
  serverStart.getMilliseconds() < 10
  ? "0"
  : "") + serverStart.getMilliseconds();
const firstLog = dateString + " " + timeString + "                 ";
console.log('\x1b[33m%s\x1b[0m', firstLog + 'Init Server');

const formatLog = (msg) => {
  const now = new Date();
  const dateString = now.getFullYear() + "-" + (
    now.getMonth() < 10
    ? "0"
    : "") + now.getMonth() + "-" + (
    now.getDate() < 10
    ? "0"
    : "") + now.getDate();
  const timeString = (
    now.getHours() < 10
    ? "0"
    : "") + now.getHours() + ":" + (
    now.getMinutes() < 10
    ? "0"
    : "") + now.getMinutes() + ":" + (
    now.getSeconds() < 10
    ? "0"
    : "") + now.getSeconds() + "." + (
    now.getMilliseconds() > 10 && now.getMilliseconds() < 100
    ? "0"
    : (
      now.getMilliseconds() < 10
      ? "00"
      : "")) + now.getMilliseconds();
  const pre = dateString + " " + timeString + "                 ";
  return pre + msg;
}

let Server = {
  config: {
    logger: {
      logLevel: "debug",
      logPath: "./logs/"
    },
    express: {
      port: 3000
    },
    app: {
      username: ""
    }
  },
  log: {
    error: (...msg) => console.log('\x1b[31m%s\x1b[0m', formatLog(msg)),
    error: (msg) => console.log('\x1b[31m%s\x1b[0m', formatLog(msg)),
    warn: (...msg) => console.log('\x1b[33m%s\x1b[0m', formatLog(msg)),
    warn: (msg) => console.log('\x1b[33m%s\x1b[0m', formatLog(msg)),
    info: (...msg) => console.log('\x1b[32m%s\x1b[0m', formatLog(msg)),
    info: (msg) => console.log('\x1b[32m%s\x1b[0m', formatLog(msg)),
    debug: (...msg) => console.log('\x1b[34m%s\x1b[0m', formatLog(msg)),
    debug: (msg) => console.log('\x1b[47m\x1b[34m%s\x1b[0m', formatLog(msg))
  },
  express: undefined,
  axios: undefined,
  hueClient: undefined
}

Server.log.debug('Server starting');
Server.log.debug('Require modules');

const fs = require('fs');
const path = require('path');
const loggerModule = require('./util/logger');
const express = require('express');
const session = require('express-session');
const sessionStore = require('connect-redis')(session);
const helmet = require('helmet');
const compression = require('compression');
const bodyParser = require("body-parser");
const axios = require("axios");

Server.log.debug('Load app config');
try {
  const configFile = fs.readFileSync(path.resolve(__dirname, 'config/app.json'), {'encoding': 'UTF-8'});
  const configJson = JSON.parse(configFile);

  Server.config.app = configJson;
} catch (e) {
  Server.log.error('App config cannot be loaded or parsing failure:', e);
  process.exit();
}

Server.log.debug('Load logger config');
try {
  const configFile = fs.readFileSync(path.resolve(__dirname, 'config/logger.json'), {'encoding': 'UTF-8'});
  const configJson = JSON.parse(configFile);

  Server.config.logger.logLevel = configJson.logLevel;
  Server.config.logger.logPath = configJson.logPath;

  Server.log = loggerModule(Server.config.logger.logLevel, Server.config.logger.logPath);
} catch (e) {
  Server.log.error('Logger config cannot be loaded or parsing failure:', e);
}

Server.log.debug('Load express config');
try {
  const configFile = fs.readFileSync(path.resolve(__dirname, 'config/express.json'), {'encoding': 'UTF-8'});
  const configJson = JSON.parse(configFile);

  Server.config.express.port = configJson.port;
} catch (e) {
  Server.log.error('Express config cannot be loaded or parsing failure:', e);
  process.exit();
}

Server.log.debug('Setting up express');

Server.express = express();
Server.express.use(compression());
Server.express.use(helmet());
Server.express.disable('x-powered-by');
Server.express.use(bodyParser.json());
Server.express.use(session({
  secret: "Tearing me apart the divided heart; Playing it's game for all these wasted years; I have been walking alone; All these years I have been carried away, carried away, yeah",
  resave: true,
  saveUninitialized: true,
  store: new sessionStore({host: '127.0.0.1', port: 6379})
}));
Server.express.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  res.setHeader('Access-Control-Allow-Headers', 'content-type');
  next();
});

Server.express.use((req, res, next) => {
  Server.log.debug('session', req.session);
  next();
});

Server.axios = axios;

Server.log.debug('Import Routes');
require('./route')(Server);

Server.log.debug('Publish client');
Server.express.use(express.static('./client/public'));

Server.express.listen(Server.config.express.port, (a) => {
  Server.log.info('Server started', {port: Server.config.express.port});
});
