/*MIT License

Copyright (©) 2019 - Randall Simpson

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.*/

const express = require('express');
const router = express.Router();
const game = require('../controller/game');

const http = require('http');

const postWebHook = (host, port, path, method, body) => {
  return new Promise(function(resolve, reject) {
    const post_data = JSON.stringify(body);
    let received_data = "";
    // An object of options to indicate where to post to
    const post_options = {
        host: host,
        port: port,
        path: path,
        method: method,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(post_data)
        }
    };

    // Set up the request
    const post_req = http.request(post_options, function(res) {
      res.setEncoding('latin1');
      res.on('data', function (data) {
          received_data += data;
      });
      res.on('end', function() {
          resolve(JSON.parse(received_data));
      });
    });

    post_req.on('error', function(e) {
        reject(e);
    });

    // post the data
    post_req.write(post_data);
    post_req.end();
  });
}

// GET
router.get('/', (req, res) => {
  //return the games
  res.json(game.list());
});

// GET specific game
router.get('/:id', (req, res) => {
  if(req.params.id) {
    res.json(game.get(parseInt(req.params.id)));
  } else {
    res.status(400).json("invalid request");
  }
});

// PUT
router.put("/:id", (req, res) => {
  if(req.params.id) {
    updateGame(req.params.id, req.body.player, req.body.location)
      .then((result) => {
        res.json({
          status: 'updated',
          game: result.game
        });
      }, (err) => {
        res.status(500).json({
          status: err.message
        });
        console.log(err);
      });
  } else {
    res.status(404).json({
      status: "error no id specified."
    });
  }
});

const updateGame = (id, player, location) => {
  return new Promise((resolve, reject) => {
    game.update(id, player, location)
      .then((result) => {
        if(!result.game.status.complete && result.game.status.player.ip && result.game.status.player.port) {
          //send webhook
          postWebHook(result.game.status.player.ip, result.game.status.player.port, '/api/v1/ai', 'POST', result.game)
          .then((result) => {
            if(result.player && result.location) {
              updateGame(id, result.player, result.location)
                .then((result2) => {
                  resolve(result2);
                }, (err) => console.error(err));
            }
          }, (err) => console.error({
            date: new Date(),
            err
          }));
        } else {
          //wait for next action.
          resolve(result);
        }
      }, (err) => reject(err));
  })
}

// POST
router.post('/', (req, res) => {
  //create a new game.
  const p1 = req.body.player1;
  p1.color = "X";
  const p2 = req.body.player2;
  p2.color = "O";
  //need to implement check for correct details on p1 and p2
  game.create(p1, p2)
    .then((info) => {
      //check if a webhook is setup.
      if(info.status.player.ip && info.status.player.port) {
        postWebHook(info.status.player.ip, info.status.player.port, '/api/v1/ai', 'POST', info)
        .then((result) => {
          if(result.player && result.location) {
            updateGame(info.id, result.player, result.location)
              .then((result2) => {
                res.json(result2);
              }, (err) => console.error(err));
          }
        }, (err) => console.error({
          date: new Date(),
          err
        }));
      } else {
        res.json(info);
      }
    }, (err) => {
      res.status(500).json({
        status: err.message
      });
      console.log(err);
    });
});

module.exports = router
