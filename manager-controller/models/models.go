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
package models

import (
  "log"
  "sort"
  "context"
  "time"
  "os"
  "database/sql"
  "fmt"
  _ "github.com/lib/pq"
)

type Peer struct {
  Ip string `json:"ip"`
  Count int `json:"count"`
}

type PeerRequest struct {
  Count int `json:"count"`
  MyIp string `json:"myIp"`
}

type RegisterBody struct {
  Ip string `json:"ip"`
}

type Solution struct {
  States [][][]interface{} `json:"states"`
  Score Score `json:"score"`
  //date
}

type Score struct {
  X int `json:"x"`
  O int `json:"o"`
}

type ByCount []Peer

func (a ByCount) Len() int           { return len(a) }
func (a ByCount) Swap(i, j int)      { a[i], a[j] = a[j], a[i] }
func (a ByCount) Less(i, j int) bool { return a[i].Count < a[j].Count }

var peers []Peer

func GetPeers(request PeerRequest) []Peer {
  //get lowest cound peers without using same IP, increment and then return.
  sort.Sort(ByCount(peers))

  var rtnList []Peer
  for len(rtnList) < request.Count {
    for j := 0; j < len(peers); j++ {
      if peers[j].Ip != request.MyIp {
        peers[j].Count ++
        rtnList = append(rtnList, peers[j])
      }
      if len(rtnList) == request.Count {
        break
      }
    }
  }
  return rtnList
}

func AddPeer(register RegisterBody) {
  peer := Peer{register.Ip, 0}
  //add the peer
  peers = append(peers, peer)
}

var psqlInfo string

//create a temp storage for solutions, so that we may connect to db and send
//a large payload at a time, instead of many little connections.
var solutions []Solution

func init() {
  host := os.Getenv("PG_HOST")
  port, err := strconv.Atoi(os.Getenv("PG_PORT"))
  if err != nil {
    log.Printf("error: %+v", err)
  }
  user := os.Getenv("PG_USER")
  password := os.Getenv("PG_PASSWORD")
  dbname := os.Getenv("PG_DBNAME")
  solutionQueue, err := strconv.Atoi(os.Getenv("SOLUTION_QUEUE_LENGTH"))
  if err != nil {
    log.Printf("error: %+v", err)
  }

  psqlInfo = fmt.Sprintf("host=%s port=%d user=%s "+
    "password=%s dbname=%s sslmode=disable",
    host, port, user, password, dbname)
}

func GetSolutionQueueCount() int {
  return len(solutions)
}

func InsertSolution(solution [][][]interface{}) {
  score := getScore(solution)
  insertSolution := Solution{solution, score}

  solutions = append(solutions, insertSolution)

  if len(solutions) > solutionQueue {
    SaveSolutions()
  }
}

func SaveSolutions() {
  db, err := sql.Open("postgres", psqlInfo)
  if err != nil {
    log.Printf("error: %+v", err)
  }
  defer db.Close()

  sqlStatements, count := getSql()

  err = db.QueryRow("BEGIN TRANSACTION;")
  if err != nil {
    log.Printf("error: %+v", err)
  }

  err = db.QueryRow(sqlStatements[0])
  if err != nil {
    log.Printf("error: %+v", err)
  }

  err = db.QueryRow(sqlStatements[1])
  if err != nil {
    log.Printf("error: %+v", err)
  }

  err = db.QueryRow(`
INSERT INTO unigram_count (state_id, x_wins, o_wins, ties)
SELECT DISTINCT insert_state,
  (SELECT SUM(i.x_wins) FROM insert_unigram i WHERE i.insert_state = u.insert_state) as x_wins,
  (SELECT SUM(i.o_wins) FROM insert_unigram i WHERE i.insert_state = u.insert_state) as o_wins,
  (SELECT SUM(i.ties) FROM insert_unigram i WHERE i.insert_state = u.insert_state) as ties
FROM insert_unigram u
LEFT JOIN unigram_count e
	on e.state_id = u.insert_state
WHERE e.state_id is null;`)
  if err != nil {
    log.Printf("error: %+v", err)
  }

  err = db.QueryRow("COMMIT TRANSACTION;")
  if err != nil {
    log.Printf("error: %+v", err)
  }
}

func getSql() ([]string, int) {
  sqlUnigramString := "INSERT INTO insert_unigram (insert_state,x_wins,o_wins,ties) VALUES "
  sqlBigramString := "INSERT INTO insert_bigram (child_insert,parent_insert,x_wins,o_wins,ties) VALUES "

  count := 0
  for _, solution := range(solutions) {
    sql := getSqlSolution(solution)
    sqlUnigramString += sql[0]
    sqlBigramString += sql[1]
    count ++
  }

  return [sqlUnigramString, sqlBigramString], count
}

func getSqlSolution(solution Solution) []string {
  //don't worry about sql injection for this project.
  x_wins := 0
  o_wins := 0
  ties := 0
  if solution.Score.X == solution.Score.O {
    ties ++
  } else if solution.Score.X > solution.Score.O {
    x_wins ++
  } else {
    o_wins ++
  }

  prevStateString := ""

  for i, state := range(solution.States) {
    stateString := stateString(state)
    sqlUnigramString += fmt.Sprintf("('%s',%d,%d,%d)", stateString, x_wins, o_wins, ties)
    if i < len(solution.States) {
      sqlUnigramString += ", "
    }

    if prevStateString != "" {
      sqlBigramString += fmt.Sprintf("('%s','%s',%d,%d,%d)", prevStateString, stateString, x_wins, o_wins, ties)
      if i < len(solution.States) {
        sqlBigramString += ", "
      }
    }
    prevStateString = stateString
  }

  return [sqlUnigramString, sqlBigramString]
}

func getScore(solution [][][]interface{}) Score {
  score := Score{0, 0}

  lastState := solution[len(solution) - 1]

  //count each item.
  for _, row := range lastState {
		for _, col := range row {
      if col == "X" {
        score.X ++
      } else if col == "O" {
        score.O ++
      }
    }
	}

  return score
}

func stateString(lastState [][]interface{}) string {
  stateString := ""

  //postfix each item.
  for _, row := range lastState {
    for _, col := range row {
      item := col.(string)
      stateString += item
    }
  }
  return stateString
}
