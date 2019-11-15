# Othello Server

*NodeJS*

Create a game server that can accept REST API calls to perform actions for the players.  The server will send a webhook to signal when it is the next players turn.  The goal is to allow containers to be setup to test the AI capabilities and record the game history and scores.  From the past games statistics and charts can be examined to determine the best approaches.

# Installation

## Manual

To install the server download the repo from github:

```sh
git clone https://github.com/randysimpson/othello.git
```

Navigate to the folder where this server is located:

```sh
cd othello/server
```

Issue npm install to install dependencies:

```sh
npm install
```

Run the server, and you should see output of `API ruuning on port 8080!`:

```sh
npm start
```

## Docker

To run this from docker issue:

```sh
docker run -d -p 8080:8080 randysimpson/othello:1.0-server-latest
```

To test the server:

```sh
curl -H "Content-Type: application/json" -X GET http://localhost:8080/api/v1/games
```

# REST API Endpoints

* `/api/v1/games`

   * `GET` - To retrieve the list of games.
   
   * `POST` - Create a new game.  The body is `Content-Type: application/json`.  If the play is to be automated using AI then the ip and the port must be specified, otherwise the play can be used by a human if the player consists of name.  An example of a human and a computer player looks like:
   
   ```json
   {
       "player1": {
         "name": "rsimpson"
       },
       "player2": {
         "ip": "192.168.0.3",
         "port": 3000
       }
     }
   ```
   
   The computer AI will use a webhook after each move to POST the game state and options if the ip and port are supplied.  If the webhook retuns a json object in the form of the required `/api/v1/games/{id}` PUT endpoint then the change will be applied to the game state.
   
   Successful response will return json with the following format:
   
   ```json
   {
        "id": 3,
        "creationDate": "2019-11-14T23:25:11.137Z",
        "player1": {
            "name": "rsimpson",
            "color": "X"
        },
        "player2": {
            "ip": "localhost",
            "port": 10000,
            "color": "O"
        },
        "status": {
            "message": "Waiting for Player X",
            "date": "2019-11-14T23:25:11.658Z",
            "player": {
                "name": "rsimpson",
                "color": "X"
            },
            "score": {
                "player1": 2,
                "player2": 2
            },
            "availableActions": [
              [3,5],
              [5,3],
              [4,2],
              [2,4]
            ]
        },
        "state": [
          [" "," "," "," "," "," "," "," "],
          [" "," "," "," "," "," "," "," "],
          [" "," "," "," "," "," "," "," "],
          [" "," "," ","X","O"," "," "," "],
          [" "," "," ","O","X"," "," "," "],
          [" "," "," "," "," "," "," "," "],
          [" "," "," "," "," "," "," "," "],
          [" "," "," "," "," "," "," "," "]
        ],
        "history": []
  }
  ```

* `/api/v1/games/{id}`

    * `PUT` - To update a move.  The body is `Content-Type: application/json` and must be in the form of:
    
    ```json
    {
      "player": {
        "name": "rsimpson",
        "color": "X"
      },
      "location": [2,4]
    }
    ```

## License

MIT License

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
SOFTWARE.
