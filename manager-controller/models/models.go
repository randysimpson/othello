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
  "os"
  "strconv"
)

type StateMap struct {
  Child string `json:"child"`
  Parent string `json:"parent"`
}

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

func init() {
  redisRW := os.Getenv("REDIS_RW")
  redisPassword := os.Getenv("REDIS_PASSWORD")
  redisPort, err := strconv.Atoi(os.Getenv("REDIS_PORT"))
  if err != nil {
    log.Printf("error: %+v", err)
  }
  
  SetupPool(redisRW, redisPort, redisPassword)
}

func InsertSolution(solution [][][]interface{}) {
  lastState := solution[len(solution) - 1]
  
  score := getScore(lastState)
  stateString := getStateString(lastState)
  
  AddSolution(stateString, score)
}

func getScore(solution [][]interface{}) Score {
  score := Score{0, 0}

  //count each item.
  for _, row := range solution {
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

func getStateString(state [][]interface{}) string {
  stateString := ""
  
  for _, row := range state {
		for _, col := range row {
      item := col.(string)
      stateString += item
    }
	}
  
  return stateString
}
