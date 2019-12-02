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
const player = require('../controller/player');

// GET
router.get('/', (req, res) => {
  //return the games
  res.json(player.list());
});

// GET specific player
router.get('/:id', (req, res) => {
  if(req.params.id) {
    res.json(player.get(parseInt(req.params.id)));
  } else {
    res.status(400).json("invalid request");
  }
});

// POST
router.post('/', (req, res) => {
  //create a new player.
  const newPlayer = req.body;
  //need to implement check for correct details on p1 and p2
  player.create(newPlayer)
    .then((info) => {
      res.json(info);
    }, (err) => {
      res.status(500).json({
        status: err.message
      });
      console.log(err);
    });
});

module.exports = router
