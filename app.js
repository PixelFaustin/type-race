const express = require('express');
const path = require('path');
const favicon = require('static-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const socketio = require('socket.io');

const app = express();
const io = socketio();
app.io = io;

const redis = require('redis');
const redisClient = redis.createClient();
redisClient.flushall();

const routes = require('./routes/index');
const live = require('./routes/live')(redisClient, io);

app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/live', live);

/// catch 404 and forwarding to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    console.log(`Error ${err.status}: ${err.message}`);
    res.status(err.status || 500).end();
  });
}

module.exports = app;
