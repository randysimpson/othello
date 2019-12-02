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

const bcrypt = require('bcrypt-nodejs');

const player = {
  queue: [],
  list: () => {
    return player.queue;
  },
  create: (newPlayer) => {
    return new Promise((resolve, reject) => {
      player.generateHash(newPlayer.password)
        .then((passHash) => {
          const p = {
            id: player.queue.length,
            creationDate: new Date(),
            username: newPlayer.username,
            password: passHash
          };
          player.queue.push(p);
          const rtnPlayer = Object.assign({}, p);
          delete rtnPlayer.password;
          resolve(rtnPlayer);
        }, (err) => {
          reject(err);
        });
    });
  },
  get: (id) => {
    const focus = player.queue.filter((item) => item.id === id);
    if(focus.length === 1) {
      const rtnPlayer = Object.assign({}, focus[0]);
      delete rtnPlayer.password;
      return rtnPlayer;
    } else {
      return {};
    }
  },
  generateHash: (password) => {
    //need to get a hash
    return new Promise((resolve, reject) => {
        bcrypt.genSalt(5, (err, salt) => {
            if (err)
                reject(err);

            bcrypt.hash(password, salt, null, (err, hash) => {
                if (err)
                    reject(err);

                resolve(hash);
            });
        });
    });
  },
  validPassword: (username, password) => {
    //need to validate against the hash.
    return new Promise((resolve, reject) => {
      const focus = player.queue.filter((item) => item.username === username);
      if(focus.length === 1) {
        const p = focus[0];
        bcrypt.compare(password, p.password, (err, isMatch) => {
            if (err) {
                reject(err);
            }

            resolve(isMatch);
        });
      }
    });
  }
};

module.exports = player;
