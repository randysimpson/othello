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

type StateMap struct {
  Child string `json:"child"`
  Parent string `json:"parent"`
}

func GetPeers(count int) []Peer {
  info := GetInfo()
  body := PeerRequest{count, info.Ip}

  result, err := Post(info.ManagerHost, info.ManagerPort, "/api/v1/peers", "application/json", body)
  if err != nil {
    log.Printf("error: %+v", err)
  }

  var peers []Peer

  items := result.([]interface{})
  for _, item := range items {
    m := item.(map[string]interface{})
    ip := m["ip"].(string)
    count := m["count"].(float64)
    peer := Peer{ip, int(count)}
    peers = append(peers, peer)
  }

  //json.Unmarshal(result, &peers)

  return peers
}

func Register() {
  info := GetInfo()
  body := RegisterBody{info.Ip}

  _, err := Post(info.ManagerHost, info.ManagerPort, "/api/v1/register", "application/json", body)
  if err != nil {
    log.Printf("error: %+v", err)
  }
}

func PostSolution(solution [][][]interface{}) {
  info := GetInfo()

  _, err := Post(info.ManagerHost, info.ManagerPort, "/api/v1/solution", "application/json", solution)
  if err != nil {
    log.Printf("error: %+v", err)
  }
}

func PostVisitedState(state []string) {
  info := GetInfo()

  _, err := Post(info.ManagerHost, info.ManagerPort, "/api/v1/visited", "application/json", state)
  if err != nil {
    log.Printf("error: %+v", err)
  }
}

func PostStateMap(statemapping []StateMap) {
  info := GetInfo()

  _, err := Post(info.ManagerHost, info.ManagerPort, "/api/v1/statemap", "application/json", statemapping)
  if err != nil {
    log.Printf("error: %+v", err)
  }
}
