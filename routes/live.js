module.exports = (redisClient, io) => {
  const express = require('express');
  const router = express.Router();
  const randomstring = require('randomstring');
  const Prando = require('prando');

  const NSP = 'live';

  const liveSocket = io.of(`/${NSP}`);
  liveSocket.on('connection', function (socket) {
    socket.on('join', info => {
      console.log(info);
      const {
        tag,
        userId
      } = info;
      console.log(`${socket.id} trying to join ${tag} as ${userId}`);
      redisClient.lrem(`live:rooms:${tag}:pending`, 0, userId, (err, reply) => {
        if (err || reply <= 0) {
          return socket.disconnect();
        }

        redisClient
          .multi()
          .hset(`live:users:${socket.id}`, 'room', tag)
          .rpush(`live:rooms:${tag}:active`, socket.id)
          .exec((err, reply) => {
            if (err) {
              return socket.disconnect();
            }

            console.log(`${socket.id} has joined room ${tag}!`);
            socket.join(tag);
            redisClient.lrange(
              `live:rooms:${tag}:active`,
              0, -1,
              (err, replies) => {
                return liveSocket.in(tag).emit('update-playerlist', replies);
              }
            );
          });
      });
    });

    socket.on('disconnect', details => {
      console.log(`${socket.id} is disconnecting.`);
      redisClient.hget(`live:users:${socket.id}`, 'room', (err, reply) => {
        if (err || !reply) {
          console.log(`Error getting room tag from socket id ${socket.id}`);
        } else {
          const tag = reply;
          redisClient
            .multi()
            .del(`live:users:${socket.id}`)
            .lrem(`live:rooms:${tag}:active`, 0, socket.id)
            .exec();

          redisClient
            .multi()
            .llen(`live:rooms:${tag}:active`)
            .llen(`live:rooms:${tag}:pending`)
            .exec((err, replies) => {
              if (err || !replies) {
                console.log(
                  'Error when attempting to garbage collect dead rooms'
                );
              } else {
                const playerCount = replies[0] + replies[1];

                if (playerCount === 0) {
                  redisClient.del(`live:rooms:${tag}`);
                }
              }
            });
        }
      });
    });
  });

  router.get('/:tag', (request, response) => {
    const tag = request.params.tag;

    redisClient.hlen(`live:rooms:${tag}`, (err, reply) => {
      if (err || reply <= 0) {
        return response.json({
          error: {
            status: 404,
            message: 'That room does not exist!',
            internal: err
          }
        });
      }

      redisClient
        .multi()
        .llen(`live:rooms:${tag}:active`)
        .llen(`live:rooms:${tag}:pending`)
        .exec((err, replies) => {
          if (err || !replies) {
            return response.json({
              error: {
                status: 400,
                message: 'Could not query room stats!',
                internal: err
              }
            });
          }

          const playerCount = replies[0];

          if (playerCount >= 8) {
            return response.json({
              error: {
                status: 406,
                message: 'The room is full!',
                internal: err
              }
            });
          }

          const userId = randomstring.generate(12);
          const socketDomain = NSP;

          redisClient.rpush(
            `live:rooms:${tag}:pending`,
            userId,
            (err, reply) => {
              if (err) {
                return response.json({
                  error: {
                    status: 400,
                    err
                  }
                });
              }

              return response.json({
                data: {
                  userId,
                  socketDomain
                }
              });
            }
          );
        });
    });
  });

  router.post('/', (request, response) => {
    const tag = randomstring.generate({
      capitalization: 'uppercase'
    });
    const seed = Math.floor(new Prando().next(0, 5000000000));
    redisClient.hset(`live:rooms:${tag}`, 'seed', seed, (err, reply) => {
      if (err) {
        console.log(`Unable to create a private room, reason: ${err}`);

        return response.json({
          error: {
            status: 500,
            message: `Unable to create a private room!`
          }
        });
      }

      return response.json({
        data: {
          tag
        }
      });
    });
  });

  return router;
};