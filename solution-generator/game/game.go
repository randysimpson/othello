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

func (g* Game) GetStateString() string {
  lastState := g.Statelist[len(g.Statelist) - 1]
  return stateString(lastState)
}

func stateString(lastState [][]interface{}) string {
  stateString := ""

  //count each item.
  for _, row := range lastState {
		for _, col := range row {
      stateString += col
    }
	}

  return stateString
}

func reverseString(oldState [][]interface{}) string {
  stateString := ""

  //count each item.
  for _, row := range oldState {
		for _, col := range row {
      stateString = col + stateString
    }
	}

  return stateString
}

// Function to rotate the matrix
// 90 degree clockwise
func rotate90Clockwise(oldState [][]interface{}) [][]interface{} {
  //take the oldstate and update it to new state.
  var newState [][]interface{}
  //newState = append(newState, oldState...)
  for i := 0; i < len(oldState); i++ {
    var newRow []interface{}
    newRow = append(newRow, oldState[i]...)
    newState = append(newState, newRow)
  }

  // Traverse each cycle
  n := len(oldState)
  for i := 0; i < n / 2; i++ {
    for j := i; j < n - i - 1; j++ {
      // Swap elements of each cycle
      // in clockwise direction
      temp := newState[i][j]
      newState[i][j] = newState[n - 1 - j][i]
      newState[n - 1 - j][i] = newState[n - 1 - i][n - 1 - j]
      newState[n - 1 - i][n - 1 - j] = newState[j][n - 1 - i]
      newState[j][n - 1 - i] = temp
    }
  }

  return newState
}

func rotate90Invert(oldState [][]interface{}) [][]interface{} {
  //rotate matrix by 90
  rotated := rotate90Clockwise(oldState)
  //we need to reverse each row.
  var newState [][]interface{}
  //newState = append(newState, oldState...)
  for r := 0; r < len(rotated); r++ {
    var newRow []interface{}
    for c := len(rotated) - 1; c >= 0; c-- {
      newRow = append(newRow, rotated[r][c])
    }
    newState = append(newState, newRow)
  }
  return newState
}

func (g* Game) GetStateMirrors() []string {
  var mirrors []string
  //get the flips, and rotated matrix's to prevent duplicate work.
  lastState := g.Statelist[len(g.Statelist) - 1]
  //get reverse string.
  reverse := reverseString(lastState)
  mirrors = append(mirrors, reverse)
  //rotated then mirrored.
  rotated := rotate90Invert(lastState)
  rotatedString := stateString(rotated)
  mirrors = append(mirrors, rotatedString)
  //inverse that.
  rotateReverse := reverseString(rotated)
  mirrors = append(mirrors, rotateReverse)
  return mirrors
}

func (g* Game) GenerateSolution() {
  options := g.GetAvailableMoves()

  //check if there are options on the other color
  //lastChance := false
  if len(options) == 0 {
    //lastChance = true
    if g.Color == "X" {
      g.Color = "O"
    } else {
      g.Color = "X"
    }
    options = g.GetAvailableMoves()
  }

  if len(options) == 0 {
    //no options left, this is solution.
    models.PostSolution(g.Statelist)
    //results = append(results, gameInfo.Statelist)
  } else {
    //get the peers to use
    peers := models.GetPeers(len(options))

    for i := 0; i < len(options); i++ {
      //for each option.
      newState := g.AddMove(options[i])
      info := models.GetInfo()
      newState.Ip = info.Ip
      //fmt.Printf("newState: %+v\n", newState)
      //http this out to another container.
      requestBody, err := json.Marshal(&newState)
      if err != nil {
        log.Printf("error: %+v", err)
      }

      response, err := http.Post("http://" + peers[i].Ip + ":" + "8080/api/v1/solution", "application/json", bytes.NewBuffer(requestBody))
      if err != nil {
        log.Printf("error: %+v", err)
      }

      defer response.Body.Close()
      _, err = ioutil.ReadAll(response.Body)
      if err != nil {
        log.Printf("error: %+v", err)
      }
    }
  }
}
