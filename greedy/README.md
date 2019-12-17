# Othello Greedy Client

*Python*

This AI client will choose an option from the list of available options that maximizes the score after the game state is applied.  The current game state and color are received from the body of the REST API endpoint.  This app was created to create an opponent that has minimal ability to get an advantage.

# Installation

## Manual

To install the client download the `main.py` file from the github repo:

```
wget https://raw.githubusercontent.com/randysimpson/othello/master/greedy/main.py
```

Run the client, and the port exposed is `9000`:

```
python main.py
```

## Docker

To run this from docker issue:

```sh
docker run -d -p 9000:9000 randysimpson/othello:1.0-greedy-latest
```

## Test

To test the client:

```sh
curl -d '{"id":2,"creationDate":"2019-11-15T23:02:51.857Z","player1":{"name":"rsimpson","color":"X"},"player2":{"ip":"othello-greedy-ai","port":9000,"color":"O"},"status":{"message":"Waiting for Player 1","date":"2019-11-15T23:02:51.857Z","player":{"name":"rsimpson","color":"X"},"score":{"player1":2,"player2":2},"availableActions":[[3,5],[5,3],[4,2],[2,4]]},"state":[[" "," "," "," "," "," "," "," "],[" "," "," "," "," "," "," "," "],[" "," "," "," "," "," "," "," "],[" "," "," ","X","O"," "," "," "],[" "," "," ","O","X"," "," "," "],[" "," "," "," "," "," "," "," "],[" "," "," "," "," "," "," "," "],[" "," "," "," "," "," "," "," "]],"history":[]}'-H "Content-Type: application/json" -X POST http://localhost:9000/api/v1/ai
```

# REST API Endpoints

* `/api/v1/ai`

   * `POST` - Used to evaluate the logic of a game state and return a random available option.  The expected body is `Content-Type: application/json` with the following syntax:

   ```
   {
        "id": 3,
        "creationDate": "2019-11-14T23:25:11.137Z",
        "player1": {
            "ip": "localhost",
            "port": 9000,
            "color": "X"
        },
        "player2": {
            "ip": "localhost",
            "port": 9000,
            "color": "O"
        },
        "status": {
            "message": "Waiting for Player X",
            "date": "2019-11-14T23:25:11.658Z",
            "player": {
                "ip": "localhost",
                "port": 9000,
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

   Response body if successful will have the following syntax:

   ```
   {
     "player": {
       "ip": "localhost",
       "port": 9000,
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
