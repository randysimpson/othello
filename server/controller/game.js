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

const game = {
  history: [],
  list: () => {
    return game.history;
  },
  create: (player1, player2) => {
    const newGame = {
      id: game.history.length,
      creationDate: new Date(),
      player1,
      player2,
      status: "Waiting for Player 1",
      statusDate: new Date(),
      state : [[' ',' ',' ',' ',' ',' ',' ',' '],[' ',' ',' ',' ',' ',' ',' ',' '],[' ',' ',' ',' ',' ',' ',' ',' '],[' ',' ',' ','X','O',' ',' ',' '],[' ',' ',' ','O','X',' ',' ',' '],[' ',' ',' ',' ',' ',' ',' ',' '],[' ',' ',' ',' ',' ',' ',' ',' '],[' ',' ',' ',' ',' ',' ',' ',' ']],
      history: []
    };
    game.history.push(newGame);
    return newGame;
  },
  update: (id, player, location) => {
    return new Promise((resolve, reject) => {
      let focus = game.history.filter((item) => item.id === parseInt(id));
      if(focus.length === 1) {
        focus = focus[0];
        //get the player making the move.
        //validate the move.
        const isValid = validMove(focus.state, player, location);
        if(isValid) {
          //put state into history, and update status.
          focus.history.push(focus.state.map(a => ({...a})));
          //get the new location from player1 and update board..
          focus.state[location[0]][location[1]] = player.color;
          focus.status = "Waiting for Player " + ((player.color === 'X') ? '2' : '1');
          focus.statusDate = new Date();
          resolve({
            status: true,
            game: focus
          });
        } else {
          reject({
            status: false,
            message: "Invalid move"
          });
        }
      } else {
        reject({
          status: false,
          message: "Invalid game."
        });
      }
    });
  }
};

const validMove = (state, player, location) => {
  return true;
};

module.exports = game;
