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
package game

import (
)

type Game struct {
  Statelist     [][][]interface{} `json:"stateList"`
	Color         string `json:"color"`
	Ip            string `json:"ip"`
}

type Score struct {
  X int `json:"x"`
  O int `json:"o"`
}

type Move struct {
  R int
  C int
}

type State struct {
  Row []interface{}
}

type GameHistory struct {
  State []State
}

func GetAvailableMovesByIndex(state [][]interface{}, r int, c int, color string) []Move {
  // get moves in the directions: l, lU, U, UR, R, RD, D, DL
  possibilities := []Move{}
  //left
  i := r
  j := c - 1
  isValid := false
  for j >= 0 {
    if state[i][j] != color && state[i][j] != " " {
      j -= 1
      isValid = true
    } else {
      if state[i][j] == " " && isValid {
        possibilities = append(possibilities, Move{i, j})
      }
      break
    }
  }

  //left-up
  i = r - 1
  j = c - 1
  isValid = false
  for i >= 0 && j >= 0 {
    if state[i][j] != color && state[i][j] != " " {
      i -= 1
      j -= 1
      isValid = true
    } else {
      if state[i][j] == " " && isValid {
        possibilities = append(possibilities, Move{i, j})
      }
      break
    }
  }

  //up
  i = r - 1
  j = c
  isValid = false
  for i >= 0 {
    if state[i][j] != color && state[i][j] != " " {
      i -= 1
      isValid = true
    } else {
      if state[i][j] == " " && isValid {
        possibilities = append(possibilities, Move{i, j})
      }
      break
    }
  }

  //right-up
  i = r - 1
  j = c + 1
  isValid = false
  for i >= 0 && j < len(state) {
    if state[i][j] != color && state[i][j] != " " {
      i -= 1
      j += 1
      isValid = true
    } else {
      if state[i][j] == " " && isValid {
        possibilities = append(possibilities, Move{i, j})
      }
      break
    }
  }

  //right
  i = r
  j = c + 1
  isValid = false
  for j < len(state) {
    if state[i][j] != color && state[i][j] != " " {
      j += 1
      isValid = true
    } else {
      if state[i][j] == " " && isValid {
        possibilities = append(possibilities, Move{i, j})
      }
      break
    }
  }

  //right-down
  i = r + 1
  j = c + 1
  isValid = false
  for i < len(state) && j < len(state) {
    if state[i][j] != color && state[i][j] != " " {
      i += 1
      j += 1
      isValid = true
    } else {
      if state[i][j] == " " && isValid {
        possibilities = append(possibilities, Move{i, j})
      }
      break
    }
  }

  //down
  i = r + 1
  j = c
  isValid = false
  for i < len(state) {
    if state[i][j] != color && state[i][j] != " " {
      i += 1
      isValid = true
    } else {
      if state[i][j] == " " && isValid {
        possibilities = append(possibilities, Move{i, j})
      }
      break
    }
  }

  //left down
  i = r + 1
  j = c - 1
  isValid = false
  for i < len(state) && j >= 0 {
    if state[i][j] != color && state[i][j] != " " {
      i += 1
      j -= 1
      isValid = true
    } else {
      if state[i][j] == " " && isValid {
        possibilities = append(possibilities, Move{i, j})
      }
      break
    }
  }

  return possibilities
}

func Contains(list []Move, item Move) bool {
  for _, v := range list {
    if v == item {
      return true
    }
  }
  return false
}

func (g* Game) GetAvailableMoves() []Move {
  //get the last state.
  lastState := g.Statelist[len(g.Statelist) - 1]
  possibilities := []Move{}
  //get moves for each existing location.
  for r := 0; r < len(lastState); r++ {
    for c := 0; c < len(lastState); c++ {
      if lastState[r][c] == g.Color {
        options := GetAvailableMovesByIndex(lastState, r, c, g.Color)
        for i := 0; i < len(options); i++ {
          if !Contains(possibilities, options[i]) {
            possibilities = append(possibilities, options[i])
          }
        }
      }
    }
  }
  //return array of the possibilities.
  return possibilities
}

func UpdateState(oldState [][]interface{}, move Move, color string) [][]interface{} {
  //take the oldstate and update it to new state.
  var newState [][]interface{}
  //newState = append(newState, oldState...)
  for i := 0; i < len(oldState); i++ {
    var newRow []interface{}
    newRow = append(newRow, oldState[i]...)
    newState = append(newState, newRow)
  }
  //update state in the directions: l, lU, U, UR, R, RD, D, DL

  //left
  i := move.R
  j := move.C - 1
  for j >= 0 {
    if newState[i][j] != color && newState[i][j] != ' ' {
      j -= 1
    } else {
      if newState[i][j] == color {
        for index := 0; index < move.C - j - 1; index++ {
          newState[i][j + index + 1] = color
        }
      }
      break
    }
  }

  //left-up
  i = move.R - 1
  j = move.C - 1
  for i >= 0 && j >= 0 {
    if newState[i][j] != color && newState[i][j] != ' ' {
      i -= 1
      j -= 1
    } else {
      if newState[i][j] == color {
        for index := 0; index < move.C - j - 1; index++ {
          newState[i + index + 1][j + index + 1] = color
        }
      }
      break
    }
  }

  //up
  i = move.R - 1
  j = move.C
  for i >= 0 {
    if newState[i][j] != color && newState[i][j] != ' ' {
      i -= 1
    } else {
      if newState[i][j] == color {
        for index := 0; index < move.R - i - 1; index++ {
          newState[i + index + 1][j] = color
        }
      }
      break
    }
  }

  //right-up
  i = move.R - 1
  j = move.C + 1
  for i >= 0 && j < len(newState) {
    if newState[i][j] != color && newState[i][j] != ' ' {
      i -= 1
      j += 1
    } else {
      if newState[i][j] == color {
        for index := 0; index < move.R - i - 1; index++ {
          newState[i + index + 1][j - index - 1] = color
        }
      }
      break
    }
  }

  //right
  i = move.R
  j = move.C + 1
  for j < len(newState) {
    if newState[i][j] != color && newState[i][j] != ' ' {
      j += 1
    } else {
      if newState[i][j] == color {
        for index := 0; index < j - move.C - 1; index++ {
          newState[i][j - index - 1] = color
        }
      }
      break
    }
  }

  //right-down
  i = move.R + 1
  j = move.C + 1
  for i < len(newState) && j < len(newState) {
    if newState[i][j] != color && newState[i][j] != ' ' {
      i += 1
      j += 1
    } else {
      if newState[i][j] == color {
        for index := 0; index < j - move.C - 1; index++ {
          newState[i - index - 1][j - index - 1] = color
        }
      }
      break
    }
  }

  //down
  i = move.R + 1
  j = move.C
  for i < len(newState) {
    if newState[i][j] != color && newState[i][j] != ' ' {
      i += 1
    } else {
      if newState[i][j] == color {
        for index := 0; index < i - move.R - 1; index++ {
          newState[i - index - 1][j] = color
        }
      }
      break
    }
  }

  //left down
  i = move.R + 1
  j = move.C - 1
  for i < len(newState) && j >= 0 {
    if newState[i][j] != color && newState[i][j] != ' ' {
      i += 1
      j -= 1
    } else {
      if newState[i][j] == color {
        for index := 0; index < i - move.R - 1; index++ {
          newState[i - index - 1][j + index + 1] = color
        }
      }
      break
    }
  }

  //modify the move spot.
  newState[move.R][move.C] = color

  return newState
}

func (g* Game) AddMove(move Move) Game {
  //create new game struct
  var newGameInfo Game
  //add new state with move to statelist.
  newGameInfo.Statelist = append(newGameInfo.Statelist, g.Statelist...)
  newState := UpdateState(g.Statelist[len(g.Statelist) - 1], move, g.Color)
  newGameInfo.Statelist = append(newGameInfo.Statelist, newState)
  //update color to opposite
  if g.Color == "X" {
    newGameInfo.Color = "O"
  } else {
    newGameInfo.Color = "X"
  }
  return newGameInfo
}
