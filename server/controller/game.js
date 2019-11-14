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
          //focus.state[location[0]][location[1]] = player.color;
          console.log(focus.state);
          setState(focus.state, location[0], location[1], player.color)
            .then((new_state) => {
              console.log(new_state);
              focus.state = new_state;
              focus.status = "Waiting for Player " + ((player.color === 'X') ? '2' : '1');
              focus.statusDate = new Date();
              resolve({
                status: true,
                game: focus
              });
            }, (err) => console.error(err));
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

//find the lists from each directions.
const getVectors = (state, r, c) => {
  return new Promise((resolve, reject) => {
    console.log({
      r,
      c
    })
    vectors = [];
    //left
    left = state[r].slice(0, c);
    console.log({
      left
    });
    //reverse order
    left = left.reverse();
    l = []
    for(let i=0;i<left.length;i++) {
      if(left[i] != ' ') {
        l.push(left[i]);
      } else {
        break;
      }
    }
    vectors.push(l);
    console.log({
      vectors
    });

    //LU
    lu = []
    i = r - 1;
    j = c - 1;
    while(i >= 0 && j >= 0) {
      if(state[i][j] != ' ') {
        lu.push(state[i][j]);
      } else {
        break;
      }
      i -= 1;
      j -= 1;
    }
    console.log({
      lu
    });
    vectors.push(lu)

    col = [];
    for(let row=0;row<state.length;row++) {
      col.push(state[row][c]);
    }
    console.log({
      col
    });

    //up
    up = col.slice(0, r);
    //reverse order
    up = up.reverse();
    u = [];
    for(let i=0;i<up.length;i++) {
      if(up[i] != ' ') {
        u.push(up[i]);
      } else {
        break;
      }
    }
    console.log({
      up
    });
    vectors.push(u);

    //RU
    ru = [];
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
    console.log({
      ru
    });
    vectors.push(ru)

    //right
    right = state[r].slice(c + 1);
    r_l = [];
    for(let i=0;i<right.length;i++) {
      if(right[i] != ' ') {
        r_l.push(right[i]);
      } else {
        break;
      }
    }
    console.log({
      right,
      r_l
    });
    vectors.push(r_l);
    console.log({
      vectors
    });

    //RD
    rd = [];
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
    console.log({
      rd
    });
    vectors.push(rd)

    //down
    down = col.slice(r + 1);
    d = [];
    for(let i=0;i<down.length;i++) {
      if(down[i] != ' ') {
        d.push(down[i]);
      } else {
        break;
      }
    }
    console.log({
      down,
      d
    });
    vectors.push(d);

    //LD
    ld = [];
    i = r + 1;
    j = c - 1;
    while(i < state.length && j >= 0) {
      if(state[i][j] != ' ') {
        ls.push(state[i][j]);
      } else {
        break;
      }
      i += 1;
      j -= 1;
    }
    console.log({
      ld
    });
    vectors.push(ld);
    resolve(vectors);
  });
}

const getActionsByIndex = (state, r, c, find, opposite) => {
  return new Promise((resolve, reject) => {
    actions = []
    getVectors(state, r, c)
      .then((vectors) => {
        for(let i=0;i<vectors.length;i++) {
          if(vectors[i].length > 0) {
            if(!vectors[i].includes(opposite)) {
              //these are valid actions
              if(i === 0) {
                //left
                let new_c = c - vectors[i].length - 1;
                if(new_c >= 0) {
                  actions.push([r, new_c]);
                }
              }
              else if(i === 1) {
                //left-up
                new_r = r - vectors[i].length - 1;
                new_c = c - vectors[i].length - 1;
                if(new_r >= 0 && new_c >= 0) {
                  actions.push([new_r, new_c]);
                }
              }
              else if(i === 2) {
                //up
                new_r = r - vectors[i].length - 1;
                if(new_r >= 0) {
                  actions.push([new_r, c]);
                }
              }
              else if(i === 3) {
                //right-up
                new_r = r - vectors[i].length - 1;
                new_c = c + vectors[i].length + 1;
                if(new_r >= 0 && new_c < state.length) {
                  actions.push([new_r, new_c]);
                }
              }
              else if(i === 4) {
                //right
                new_c = c + vectors[i].length + 1;
                if(new_c < state.length) {
                  actions.push([r, new_c]);
                }
              }
              else if(i === 5) {
                //right-down
                new_r = r + vectors[i].length + 1;
                new_c = c + vectors[i].length + 1;
                if(new_r < state.length && new_c < state.length) {
                  actions.push([new_r, new_c]);
                }
              }
              else if(i === 6) {
                //down
                new_r = r + vectors[i].length + 1;
                if(new_r < state.length) {
                  actions.push([new_r, c]);
                }
              }
              else if(i === 7) {
                //left-down
                new_r = r + vectors[i].length + 1;
                new_c = c - vectors[i].length - 1;
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
    actions = [];
    indexFind = 'X';
    if(find == 'X') {
      indexFind = 'O';
    }
    let promises = [];
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
            if(!actions.includes(results[i][j])) {
              actions.push(results[i][j]);
            }
          }
        }
        resolve(actions);
      }, (err) => reject(err));
  });
};

const getCountList = (l, color) => {
  return new Promise((resolve, reject) => {
    count = 0;
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
        console.log("vectors: ");
        console.log(vectors);
        new_state = state.map(a => ([...a]));
        console.log(new_state);
        for(let i=0;i<vectors.length;i++) {
          if(vectors[i].length > 0) {
            if(vectors[i].includes(color) >= 0) {
              //find the count of non color in the list.
              getCountList(vectors[i], color)
                .then((count) => {
                  console.log({
                    count,
                    i
                  })
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
                        console.log({
                          r,
                          c: c + (j + 1),
                          color
                        });
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
