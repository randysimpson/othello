# Othello Server

Create a game server that can accept REST API calls to perform actions for the players.  The server will send a webhook to signal when it is the next players turn.  The goal is to allow containers to be setup to test the AI capabilities and record the game history and scores.  From the past games statistics and charts can be examined to determine the best approaches.

More Details to follow

# REST API Endpoints

* `/api/v1/games`

   * `GET` - To retrieve the list of games.
   
   * `POST` - Create a new game.  The body is `Content-Type: application/json` and must be in the form of:
   
   ```
   {
       "player1": {
         "ip": "192.168.0.2",
         "port": 3000
       },
       "player2": {
         "ip": "192.168.0.3",
         "port": 3000
       }
     }
   ```

* `/api/v1/games/{id}`

    * `PUT` - To update a move.  The body is `Content-Type: application/json` and must be in the form of:
    
    ```
    {
      "player": {
        "ip": "192.168.0.2",
        "port": 3000,
        "color": "X"
      },
      "location": [0,3]
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
