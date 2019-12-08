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
package api

import (
  "net/http"
  "log"
  "encoding/json"
  "github.com/gorilla/mux"
  "io/ioutil"
  "manager-controller/models"
)

func getSolution(w http.ResponseWriter, r *http.Request) {
  var solution [][][]interface{}
  reqBody, err := ioutil.ReadAll(r.Body)
  if err != nil {
    log.Printf("error: %+v", err)
  }

  json.Unmarshal(reqBody, &solution)

  models.InsertSolution(solution)

  w.WriteHeader(http.StatusCreated)
  w.Header().Set("Content-Type", "application/json; charset=UTF-8")
  json.NewEncoder(w).Encode(solution)
}

func getPeers(w http.ResponseWriter, r *http.Request) {
  var info models.PeerRequest

  reqBody, err := ioutil.ReadAll(r.Body)
  if err != nil {
    log.Printf("error: %+v", err)
  }

  json.Unmarshal(reqBody, &info)

  peers := models.GetPeers(info)

  w.WriteHeader(http.StatusCreated)
  w.Header().Set("Content-Type", "application/json; charset=UTF-8")
  json.NewEncoder(w).Encode(peers)
}

func Register(w http.ResponseWriter, r *http.Request) {
  var info models.RegisterBody
  reqBody, err := ioutil.ReadAll(r.Body)
  if err != nil {
    log.Printf("error: %+v", err)
  }

  json.Unmarshal(reqBody, &info)

  models.AddPeer(info)

  w.WriteHeader(http.StatusCreated)
  w.Header().Set("Content-Type", "application/json; charset=UTF-8")
  json.NewEncoder(w).Encode(info)
}

func setState(w http.ResponseWriter, r *http.Request) {
  var states []string
  
  reqBody, err := ioutil.ReadAll(r.Body)
  if err != nil {
    log.Printf("error: %+v", err)
  }
  
  //got to get the state from the payload.
  json.Unmarshal(reqBody, &states)
  
  //add the state to the model
  models.AddStates(states)
  
  w.WriteHeader(http.StatusCreated)
  w.Header().Set("Content-Type", "application/json; charset=UTF-8")
  json.NewEncoder(w).Encode(states)
}

func setParents(w http.ResponseWriter, r *http.Request) {
  var stateMaping []models.StateMap
  
  reqBody, err := ioutil.ReadAll(r.Body)
  if err != nil {
    log.Printf("error: %+v", err)
  }
  
  //got to get the state map from the payload.
  json.Unmarshal(reqBody, &stateMaping)
  
  //add map to model
  models.AddStateMaping(stateMaping)
  
  w.WriteHeader(http.StatusCreated)
  w.Header().Set("Content-Type", "application/json; charset=UTF-8")
  json.NewEncoder(w).Encode(stateMaping)
}

func HandleRequests() {
  // creates a new instance of a mux router
  myRouter := mux.NewRouter().StrictSlash(true)

  myRouter.HandleFunc("/api/v1/solution", getSolution).Methods("POST")
  myRouter.HandleFunc("/api/v1/peers", getPeers).Methods("POST")
  myRouter.HandleFunc("/api/v1/register", Register).Methods("POST")
  myRouter.HandleFunc("/api/v1/visited", setState).Methods("POST")
  myRouter.HandleFunc("/api/v1/statemap", setParents).Methods("POST")

  // finally, instead of passing in nil, we want
  // to pass in our newly created router as the second
  // argument
  http.ListenAndServe(":9090", myRouter)
}
