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
  "solution-generator/game"
)

func getSolution(w http.ResponseWriter, r *http.Request) {
  var gameInfo game.Game
  reqBody, err := ioutil.ReadAll(r.Body)
  if err != nil {
    log.Printf("error: %+v", err)
  }

  json.Unmarshal(reqBody, &gameInfo)

  go gameInfo.GenerateSolution()

  w.WriteHeader(http.StatusOK)
  w.Header().Set("Content-Type", "application/json; charset=UTF-8")
}

func HandleRequests() {
  // creates a new instance of a mux router
  myRouter := mux.NewRouter().StrictSlash(true)

  myRouter.HandleFunc("/api/v1/solution", getSolution).Methods("POST")
  //myRouter.HandleFunc("/api/v1/peers", setPeers).Methods("POST")
  //myRouter.HandleFunc("/api/v1/peers", getPeers)

  // finally, instead of passing in nil, we want
  // to pass in our newly created router as the second
  // argument
  http.ListenAndServe(":8080", myRouter)
}
