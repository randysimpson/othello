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
    return new Promise((resolve, reject) => {
      const newGame = {
        id: game.history.length,
        creationDate: new Date(),
        player1,
        player2,
        status: {
          message: "Waiting for Player 1",
          date: new Date(),
          player: player1,
          score: {
            player1: 2,
            player2: 2
          }
        },
        state : [[' ',' ',' ',' ',' ',' ',' ',' '],[' ',' ',' ',' ',' ',' ',' ',' '],[' ',' ',' ',' ',' ',' ',' ',' '],[' ',' ',' ','X','O',' ',' ',' '],[' ',' ',' ','O','X',' ',' ',' '],[' ',' ',' ',' ',' ',' ',' ',' '],[' ',' ',' ',' ',' ',' ',' ',' '],[' ',' ',' ',' ',' ',' ',' ',' ']],
        history: []
      };
      getActions(newGame.state, 'X')
        .then((actions) => {
          newGame.status.availableActions = actions;
          game.history.push(newGame);
          resolve(newGame);
        }, (err) => reject(err));
    });
  },
  update: (id, player, location) => {
    return new Promise((resolve, reject) => {
      let focus = game.history.filter((item) => item.id === parseInt(id));
      if(focus.length === 1) {
        focus = focus[0];
        //get the player making the move, check if valid player.
        if(focus.status.player.color != player.color) {
          return reject({
            status: false,
            message: "Invalid player"
          });
        }
        //validate the move.
        const isValid = validMove(focus.status.availableActions, location);
        if(isValid) {
          //put state into history, and update status.
          focus.history.push(focus.state.map(a => ([...a])));
          //get the new location from player1 and update board..
          setState(focus.state, location[0], location[1], player.color)
            .then((new_state) => {
              //console.log(new_state);
              focus.state = new_state;
              const score = getScore(new_state);
              focus.status.score.player1 = score[0];
              focus.status.score.player2 = score[1];
              let focusPlayer = focus.player1;
              if(player.color == focus.player1.color) {
                focusPlayer = focus.player2;
              }
              getActions(focus.state, focusPlayer.color)
                .then((actions) => {
                  if(actions.length > 0) {
                    focus.status.availableActions = actions;
                    focus.status.message = "Waiting for Player " + ((player.color === 'X') ? '2' : '1');
                    focus.status.player = focusPlayer
                    focus.status.date = new Date();
                    resolve({
                      status: true,
                      game: focus
                    });
                  } else {
                    //switch players.
                    if(focusPlayer.color != focus.player1.color)
                      focusPlayer = focus.player1;
                    else
                      focusPlayer = focus.player2
                    getActions(focus.state, player.color === 'X' ? 'X' : 'O')
                      .then((actions) => {
                        if(actions.length > 0) {
                          focus.status.availableActions = actions;
                          focus.status.message = "Waiting for Player " + ((player.color === 'X') ? '1' : '2');
                          focus.status.player = focusPlayer
                          focus.status.date = new Date();
                        } else {
                          //no moves left.
                          focus.status.availableActions = [];
                          focus.status.winner = score[0] > score[1] ? focus.player1 : focus.player2;
                          focus.status.message = "Completed winner is " + focus.status.winner.color;
                          focus.status.date = new Date();
                          focus.status.complete = true;
                        }
                        resolve({
                          status: true,
                          game: focus
                        });
                      }, (err) => {
                        reject({
                          status: false,
                          message: "Error getting actions.",
                          err
                        });
                      });
                  }
                }, (err) => {
                  reject({
                    status: false,
                    message: "Error getting actions.",
                    err
                  });
                });
            }, (err) => {
              reject({
                status: false,
                message: "Invalid move",
                err
              });
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

const validMove = (actions, location) => {
  for(let i = 0; i < actions.length; i++) {
    if(actions[i][0] === location[0] && actions[i][1] === location[1]) {
      return true;
    }
  }
  //never found true condition.
  return false;
};

const getScore = (state) => {
  let p1 = 0;
  let p2 = 0;
  for(let r = 0; r < state.length; r++) {
    for(let c=0; c < state[r].length; c++) {
      if(state[r][c] == 'X')
        p1++;
      else if(state[r][c] == 'O')
        p2++;
    }
  }
  return [p1, p2];
}

//find the lists from each directions.
const getVectors = (state, r, c) => {
  return new Promise((resolve) => {
    const vectors = [];
    //left
    let left = state[r].slice(0, c);

    //reverse order
    left = left.reverse();
    const l = []
    for(let i=0;i<left.length;i++) {
      if(left[i] != ' ') {
        l.push(left[i]);
      } else {
        break;
      }
    }
    vectors.push(l);

    //LU
    const lu = []
    let i = r - 1;
    let j = c - 1;
    while(i >= 0 && j >= 0) {
      if(state[i][j] != ' ') {
        lu.push(state[i][j]);
      } else {
        break;
      }
      i -= 1;
      j -= 1;
    }
    vectors.push(lu)

    //setup an array for the column data.
    const col = [];
    for(let row=0;row<state.length;row++) {
      col.push(state[row][c]);
    }

    //up
    let up = col.slice(0, r);
    //reverse order
    up = up.reverse();
    const u = [];
    for(let i=0;i<up.length;i++) {
      if(up[i] != ' ') {
        u.push(up[i]);
      } else {
        break;
      }
    }
    vectors.push(u);

    //RU
    const ru = [];
    i = r - 1;
    j = c + 1;
    while(i >= 0 && j < state.length) {
      if(state[i][j] != ' ') {
        ru.push(state[i][j]);
      } else {
        break;
      }
      i -= 1;
      j += 1;
    }
    vectors.push(ru)

    //right
    const right = state[r].slice(c + 1);
    const r_l = [];
    for(let i=0;i<right.length;i++) {
      if(right[i] != ' ') {
        r_l.push(right[i]);
      } else {
        break;
      }
    }
    vectors.push(r_l);

    //RD
    const rd = [];
    i = r + 1;
    j = c + 1;
    while(i < state.length && j < state.length) {
      if(state[i][j] != ' ') {
        rd.push(state[i][j]);
      } else {
        break;
      }
      i += 1;
      j += 1;
    }
    vectors.push(rd)

    //down
    const down = col.slice(r + 1);
    const d = [];
    for(let i=0;i<down.length;i++) {
      if(down[i] != ' ') {
        d.push(down[i]);
      } else {
        break;
      }
    }
    vectors.push(d);

    //LD
    const ld = [];
    i = r + 1;
    j = c - 1;
    while(i < state.length && j >= 0) {
      if(state[i][j] != ' ') {
        ld.push(state[i][j]);
      } else {
        break;
      }
      i += 1;
      j -= 1;
    }
    vectors.push(ld);
    resolve(vectors);
  });
}

const getActionsByIndex = (state, r, c, find, opposite) => {
  return new Promise((resolve, reject) => {
    const actions = []
    getVectors(state, r, c)
      .then((vectors) => {
        for(let i=0;i<vectors.length;i++) {
          if(vectors[i].length > 0) {
            if(!vectors[i].includes(opposite)) {
              //these are valid actions
              if(i === 0) {
                //left
                const new_c = c - vectors[i].length - 1;
                if(new_c >= 0) {
                  actions.push([r, new_c]);
                }
              }
              else if(i === 1) {
                //left-up
                const new_r = r - vectors[i].length - 1;
                const new_c = c - vectors[i].length - 1;
                if(new_r >= 0 && new_c >= 0) {
                  actions.push([new_r, new_c]);
                }
              }
              else if(i === 2) {
                //up
                const new_r = r - vectors[i].length - 1;
                if(new_r >= 0) {
                  actions.push([new_r, c]);
                }
              }
              else if(i === 3) {
                //right-up
                const new_r = r - vectors[i].length - 1;
                const new_c = c + vectors[i].length + 1;
                if(new_r >= 0 && new_c < state.length) {
                  actions.push([new_r, new_c]);
                }
              }
              else if(i === 4) {
                //right
                const new_c = c + vectors[i].length + 1;
                if(new_c < state.length) {
                  actions.push([r, new_c]);
                }
              }
              else if(i === 5) {
                //right-down
                const new_r = r + vectors[i].length + 1;
                const new_c = c + vectors[i].length + 1;
                if(new_r < state.length && new_c < state.length) {
                  actions.push([new_r, new_c]);
                }
              }
              else if(i === 6) {
                //down
                const new_r = r + vectors[i].length + 1;
                if(new_r < state.length) {
                  actions.push([new_r, c]);
                }
              }
              else if(i === 7) {
                //left-down
                const new_r = r + vectors[i].length + 1;
                const new_c = c - vectors[i].length - 1;
                if(new_r < state.length && new_c >= 0) {
                  actions.push([new_r, new_c]);
                }
              }
            }
          }


        }
        resolve(actions);
      }, (err) => reject(err));
  });
}

const getActions = (state, find) => {
  return new Promise((resolve, reject) => {
    const actions = [];
    let indexFind = 'X';
    if(find == 'X') {
      indexFind = 'O';
    }
    const promises = [];
    for(let r=0;r<state.length;r++) {
      for(let c=0;c<state[r].length;c++) {
        if(state[r][c] == find) {
          promises.push(getActionsByIndex(state, r, c, indexFind, find));
        }
      }
    }
    Promise.all(promises)
      .then((results) => {
        //add possibilies that are not already in action.
        for(let i=0;i<results.length;i++){
          for(let j=0;j<results[i].length;j++) {
            const find = actions.filter((item) => item[0] == results[i][j][0] && item[1] == results[i][j][1]);
            if(find.length === 0) {
              actions.push(results[i][j]);
            }
          }
        }
        resolve(actions);
      }, (err) => reject(err));
  });
};

const getCountList = (l, color) => {
  return new Promise((resolve) => {
    let count = 0;
    for(let i=0;i<l.length;i++) {
      if(l[i] != color) {
        count++;
      } else {
        break;
      }
    }
    resolve(count);
  });
}

const setState = (state, r, c, color) => {
  return new Promise((resolve, reject) => {
    getVectors(state, r, c)
      .then((vectors) => {
        const new_state = state.map(a => ([...a]));
        for(let i=0;i<vectors.length;i++) {
          if(vectors[i].length > 0) {
            if(vectors[i].includes(color)) {
              //find the count of non color in the list.
              getCountList(vectors[i], color)
                .then((count) => {
                  if(count > 0) {
                    if(i === 0) {
                      //left
                      for(let j=0;j<count;j++) {
                        new_state[r][c - (j + 1)] = color;
                      }
                    } else if(i === 1) {
                      //left-up
                      for(let j=0;j<count;j++) {
                        new_state[r - (j + 1)][c - (j + 1)] = color
                      }
                    } else if(i === 2) {
                      //up
                      for(let j=0;j<count;j++) {
                        new_state[r - (j + 1)][c] = color
                      }
                    } else if(i === 3) {
                      //right-up
                      for(let j=0;j<count;j++) {
                        new_state[r - (j + 1)][c + (j + 1)] = color
                      }
                    } else if(i === 4) {
                      //right
                      for(let j=0;j<count;j++) {
                        new_state[r][c + (j + 1)] = color
                      }
                    } else if(i === 5) {
                      //right-down
                      for(let j=0;j<count;j++) {
                        new_state[r + (j + 1)][c + (j + 1)] = color
                      }
                    } else if(i === 6) {
                      //down
                      for(let j=0;j<count;j++) {
                        new_state[r + (j + 1)][c] = color
                      }
                    } else if(i === 7) {
                      //left-down
                      for(let j=0;j<count;j++) {
                        new_state[r + (j + 1)][c - (j + 1)] = color
                      }
                    }
                  }
                }, (err) => reject(err));
            }
          }
        }
        new_state[r][c] = color
        resolve(new_state);
      }, (err) => reject(err));
  });
}

module.exports = game;
