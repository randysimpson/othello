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
  "bytes"
  "solution-generator/game"
  "solution-generator/models"
)

func getSolution(w http.ResponseWriter, r *http.Request) {
  var gameInfo game.Game
  reqBody, err := ioutil.ReadAll(r.Body)
  if err != nil {
    log.Printf("error: %+v", err)
  }

  json.Unmarshal(reqBody, &gameInfo)

  options := gameInfo.GetAvailableMoves()

  //check if there are options on the other color
  if len(options) == 0 {
    if gameInfo.Color == "X" {
      gameInfo.Color = "O"
    } else {
      gameInfo.Color = "X"
    }
    options = gameInfo.GetAvailableMoves()
  }


  if len(options) == 0 {
    //no options left, this is solution.
    models.PostSolution(gameInfo.Statelist)
  } else {
    //get the peers to use
    peers := models.GetPeers(len(options))

    for i := 0; i < len(options); i++ {
      //for each option.
      newState := gameInfo.AddMove(options[i])
      info := models.GetInfo()
      newState.Ip = info.Ip

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

  w.WriteHeader(http.StatusOK)
  w.Header().Set("Content-Type", "application/json; charset=UTF-8")
  json.NewEncoder(w).Encode(options)
}

func HandleRequests() {
  // creates a new instance of a mux router
  myRouter := mux.NewRouter().StrictSlash(true)

  myRouter.HandleFunc("/api/v1/solution", getSolution).Methods("POST")

  // finally, instead of passing in nil, we want
  // to pass in our newly created router as the second
  // argument
  http.ListenAndServe(":8080", myRouter)
}
