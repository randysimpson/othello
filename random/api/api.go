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
  "fmt"
  "net/http"
  "log"
  "encoding/json"
  "github.com/gorilla/mux"
  "io/ioutil"
  "math/rand"
)

type Game struct {
  ID            int `json:"id"`
	CreationDate  string `json:"creationDate"`
	Player1       Player `json:"player1"`
  Player2       Player `json:"player2"`
  Status        Status `json:"status"`
  State []interface{} `json:"state"`
  History []interface{} `json:"history"`
}

type Player struct {
  Ip string `json:"ip"`
  Port int `json:"port"`
  Color string `json:"color"`
}

type Status struct {
   Message string `json:"message"`
   Date string `json:"date"`
   Player Player `json:"player"`
   Score Score `json:"score"`
   AvailableActions []interface{} `json:"availableActions"`
}

type Score struct {
  Player1 int `json:"player1"`
  Player2 int `json:"player2"`
}

type Answer struct {
  Player Player `json:"player"`
  Location interface{} `json:"location"`
}

func homePage(w http.ResponseWriter, r *http.Request) {
  fmt.Fprintf(w, "Welcome")
  fmt.Println("endpoint hit")
}

func getMove(w http.ResponseWriter, r *http.Request) {
  var gameInfo Game
  reqBody, err := ioutil.ReadAll(r.Body)
  if err != nil {
    log.Printf("error: %+v", err)
  }
  
  json.Unmarshal(reqBody, &gameInfo)
  
  index := rand.Intn(len(gameInfo.Status.AvailableActions))

  var answer Answer
  answer.Player = gameInfo.Status.Player
  answer.Location = gameInfo.Status.AvailableActions[index]
  
  w.WriteHeader(http.StatusCreated)
  w.Header().Set("Content-Type", "application/json; charset=UTF-8")  
  json.NewEncoder(w).Encode(answer)
}

func HandleRequests() {
  // creates a new instance of a mux router
  myRouter := mux.NewRouter().StrictSlash(true)
  // replace http.HandleFunc with myRouter.HandleFunc
  //fs := http.FileServer(http.Dir("../public/"))
  //myRouter.Handle("/static/", http.StripPrefix("/static/", fs))
  //myRouter.Handle("/public/", http.StripPrefix(strings.TrimRight("/public/", "/"), http.FileServer(http.Dir("public"))))
  //myRouter.HandleFunc("/public/", func(w http.ResponseWriter, r *http.Request) {
  //  fmt.Println(r.URL)
  //  http.ServeFile(w, r, r.URL.Path[1:])
  //})
  myRouter.HandleFunc("/", homePage)

  // myRouter.HandleFunc("/", homePage)
  myRouter.HandleFunc("/api/v1/ai", getMove).Methods("POST")
  
  // finally, instead of passing in nil, we want
  // to pass in our newly created router as the second
  // argument
  http.ListenAndServe(":10000", myRouter)
}