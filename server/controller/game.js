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
      status: "Initializing",
      statusDate: new Date(),
      state: [[' ',' ',' ',' ',' ',' ',' ',' '],[' ',' ',' ',' ',' ',' ',' ',' '],[' ',' ',' ',' ',' ',' ',' ',' '],[' ',' ',' ',' ',' ',' ',' ',' '],[' ',' ',' ',' ',' ',' ',' ',' '],[' ',' ',' ',' ',' ',' ',' ',' '],[' ',' ',' ',' ',' ',' ',' ',' '],[' ',' ',' ',' ',' ',' ',' ',' ']],
      history: []
    };
    game.history.push(newGame);
    return newGame;
  },
  run: (id) => {
    let focus = game.history.filter((item) => item.id === id);
    if(focus.length === 1) {
      focus = focus[0];
      focus.status = "Waiting for Player 1";
      focus.statusDate = new Date();
      focus.state = [[' ',' ',' ',' ',' ',' ',' ',' '],[' ',' ',' ',' ',' ',' ',' ',' '],[' ',' ',' ',' ',' ',' ',' ',' '],[' ',' ',' ','X','O',' ',' ',' '],[' ',' ',' ','O','X',' ',' ',' '],[' ',' ',' ',' ',' ',' ',' ',' '],[' ',' ',' ',' ',' ',' ',' ',' '],[' ',' ',' ',' ',' ',' ',' ',' ']];
      //put state into history.
      focus.history.push(focus.state.map(a => ({...a})));
    }
  },
  update: (id, location) => {
    //get the new location from player1.
    const location = [3, 2];
    //update board.
    focus.state[location[0]][location[1]] = 'X';
    //put state into history, and update status.
    focus.history.push(focus.state.map(a => ({...a})));
    focus.status = "Waiting for Player 2";
    focus.statusDate = new Date();
  }
};

module.exports = game;
