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

// GET
router.get('/', (req, res) => {
  //return the games
  res.json(game.list());
});

// PUT
router.put("/", (req, res) => {
  game.run(0);
  res.json({
    status: "begin"
  });
});

// POST
router.post('/', (req, res) => {
  //create a new game.
  const p1 = req.body.player1;
  const p2 = req.body.player2;
  //need to implement check for correct details on p1 and p2
  const info = game.create(p1, p2);
  res.json(info);
});

module.exports = router
