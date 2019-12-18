# Othello

A game that can be used to learn about AI and ML.  This project utilized microservice architecture to allow for the server and clients to communicate with REST API.  The advantage to this is that the opponents can be easily swapped in and out, new ones can be created quickly, and there is no dependency on code language.  These components can be created and scaled easily using Kubernets kubectl command.

![Microservices](https://github.com/randysimpson/othello/raw/master/microservices.PNG "Microservices")

## Code

* The [Server](https://github.com/randysimpson/othello/tree/master/server) component is written in NodeJS, and it's job is to handle game states, issue webhooks for notification of play, validate moves/changes in state, and to handle history via a REST API.

* [Random AI Client](https://github.com/randysimpson/othello/tree/master/random) component is written in GoLang, and it's job is to choose at random a location to be modified during gameplay from the available actions list received from the server webhook.

* [Greedy AI Client](https://github.com/randysimpson/othello/tree/master/greedy) component written in python, it's job is to utilize a greedy search pattern to return the option with the highest yield of immediate value from the available actions list received from the server webhook.

* [Custom AI Client](https://github.com/randysimpson/othello/tree/master/custom) component written in python, it's job is to utilize a custom AI algorithm to return the optimal option from the available actions list received from the server webhook.

* (*In Progess*) [Othello UI](https://github.com/randysimpson/othello/tree/master/othello-ui) The frontend for the application written in React.  Allows for stats and listing of current games.  Also a view of the history from a game.

* (*In Progess*) [Manager Controller](https://github.com/randysimpson/othello/tree/master/manager-controller) This component is written in GoLang, and will allow for saving states to a postgres database which can then be used to determine the best possible solution.

* (*In Progess*) [Solution Generator](https://github.com/randysimpson/othello/tree/master/solution-generator) This component is written in GoLang, and will be utilized to generate possible solutions for Othello game play.  These solutions will be sent to REST API of Manager-Controller.

## Deployment

To deploy the server and the AI clients using Kubernetes, issue the following command:

```
kubectl create -f https://raw.githubusercontent.com/randysimpson/othello/master/othello-deployment.yaml
```

### Game play

get the ip address of the othello-server:

```sh
export othello_server_ip=$(kubectl get svc othello-server | grep othello | awk '{split($0, a, " "); print a[3]}')
```

#### Computer vs Human

create a game of player and computer random player:

```sh
curl -d '{"player1":{"name":"rsimpson"},"player2":{"ip":"othello-random-ai","port":10000}}' -H "Content-Type: application/json" -X POST http://$othello_server_ip:8080/api/v1/games
```

response:

```json
{"id":2,"creationDate":"2019-11-15T23:02:51.857Z","player1":{"name":"rsimpson","color":"X"},"player2":{"ip":"othello-random-ai","port":10000,"color":"O"},"status":{"message":"Waiting for Player 1","date":"2019-11-15T23:02:51.857Z","player":{"name":"rsimpson","color":"X"},"score":{"player1":2,"player2":2},"availableActions":[[3,5],[5,3],[4,2],[2,4]]},"state":[[" "," "," "," "," "," "," "," "],[" "," "," "," "," "," "," "," "],[" "," "," "," "," "," "," "," "],[" "," "," ","X","O"," "," "," "],[" "," "," ","O","X"," "," "," "],[" "," "," "," "," "," "," "," "],[" "," "," "," "," "," "," "," "],[" "," "," "," "," "," "," "," "]],"history":[]}
```

Issue a move from the computer player, make sure to add the game id to the endpoint, in this example it is *2* (http://$othello_server_ip:8080/api/v1/games/`2`):

```sh
curl -d '{"player":{"name":"rsimpson","color":"X"},"location":[2,4]}' -H "Content-Type: application/json" -X PUT http://$othello_server_ip:8080/api/v1/games/2
```

response:

```json
{"status":"updated","game":{"id":2,"creationDate":"2019-11-15T23:02:51.857Z","player1":{"name":"rsimpson","color":"X"},"player2":{"ip":"othello-random-ai","port":10000,"color":"O"},"status":{"message":"Waiting for Player 1","date":"2019-11-15T23:14:43.748Z","player":{"name":"rsimpson","color":"X"},"score":{"player1":3,"player2":3},"availableActions":[[5,5],[5,3],[5,6],[5,4],[5,2]]},"state":[[" "," "," "," "," "," "," "," "],[" "," "," "," "," "," "," "," "],[" "," "," "," ","X"," "," "," "],[" "," "," ","X","X"," "," "," "],[" "," "," ","O","O","O"," "," "],[" "," "," "," "," "," "," "," "],[" "," "," "," "," "," "," "," "],[" "," "," "," "," "," "," "," "]],"history":[[[" "," "," "," "," "," "," "," "],[" "," "," "," "," "," "," "," "],[" "," "," "," "," "," "," "," "],[" "," "," ","X","O"," "," "," "],[" "," "," ","O","X"," "," "," "],[" "," "," "," "," "," "," "," "],[" "," "," "," "," "," "," "," "],[" "," "," "," "," "," "," "," "]],[[" "," "," "," "," "," "," "," "],[" "," "," "," "," "," "," "," "],[" "," "," "," ","X"," "," "," "],[" "," "," ","X","X"," "," "," "],[" "," "," ","O","X"," "," "," "],[" "," "," "," "," "," "," "," "],[" "," "," "," "," "," "," "," "],[" "," "," "," "," "," "," "," "]]]}}
```

#### Computer vs Computer

create a game of 2 computer random players:

```sh
curl -d '{"player1":{"ip":"othello-random-ai","port":10000},"player2":{"ip":"othello-random-ai","port":10000}}' -H "Content-Type: application/json" -X POST http://$othello_server_ip:8080/api/v1/games
```

response:

```json
{"status":true,"game":{"id":3,"creationDate":"2019-11-15T23:03:04.393Z","player1":{"ip":"othello-random-ai","port":10000,"color":"X"},"player2":{"ip":"othello-random-ai","port":10000,"color":"O"},"status":{"message":"Completed winner is O","date":"2019-11-15T23:03:04.640Z","player":{"ip":"othello-random-ai","port":10000,"color":"O"},"score":{"player1":29,"player2":35},"availableActions":[],"winner":{"ip":"othello-random-ai","port":10000,"color":"O"},"complete":true},"state":[["O","O","X","X","X","X","X","X"],["O","O","X","X","O","O","O","O"],["O","O","X","O","O","O","O","X"],["O","X","O","O","O","O","X","X"],["O","X","O","O","O","O","X","X"],["O","O","O","O","O","X","O","X"],["O","O","O","O","X","O","X","X"],["X","X","X","X","X","X","X","X"]],"history":[[[" "," "," "," "," "," "," "," "],[" "," "," "," "," "," "," "," "],[" "," "," "," "," "," "," "," "],[" "," "," ","X","O"," "," "," "],[" "," "," ","O","X"," "," "," "],[" "," "," "," "," "," "," "," "],[" "," "," "," "," "," "," "," "],[" "," "," "," "," "," "," "," "]],[[" "," "," "," "," "," "," "," "],[" "," "," "," "," "," "," "," "],[" "," "," "," "," "," "," "," "],[" "," "," ","X","O"," "," "," "],[" "," "," ","X","X"," "," "," "],[" "," "," ","X"," "," "," "," "],[" "," "," "," "," "," "," "," "],[" "," "," "," "," "," "," "," "]],[[" "," "," "," "," "," "," "," "],[" "," "," "," "," "," "," "," "],[" "," "," "," "," "," "," "," "],[" "," ","O","O","O"," "," "," "],[" "," "," ","X","X"," "," "," "],[" "," "," ","X"," "," "," "," "],[" "," "," "," "," "," "," "," "],[" "," "," "," "," "," "," "," "]],[[" "," "," "," "," "," "," "," "],[" "," "," "," "," "," "," "," "],[" "," "," "," "," ","X"," "," "],[" "," ","O","O","X"," "," "," "],[" "," "," ","X","X"," "," "," "],[" "," "," ","X"," "," "," "," "],[" "," "," "," "," "," "," "," "],[" "," "," "," "," "," "," "," "]],[[" "," "," "," "," "," "," "," "],[" "," "," "," "," "," "," "," "],[" "," "," "," "," ","X"," "," "],[" "," ","O","O","X"," "," "," "],[" "," "," ","O","X"," "," "," "],[" "," "," ","O"," "," "," "," "],[" "," "," ","O"," "," "," "," "],[" "," "," "," "," "," "," "," "]],[[" "," "," "," "," "," "," "," "],[" "," "," "," "," "," "," "," "],[" "," "," "," "," ","X"," "," "],[" "," ","O","O","X"," "," "," "],[" "," "," ","X","X"," "," "," "],[" "," ","X","O"," "," "," "," "],[" "," "," ","O"," "," "," "," "],[" "," "," "," "," "," "," "," "]],[[" "," "," "," "," "," "," "," "],[" "," "," "," "," "," "," "," "],[" "," "," "," "," ","X"," "," "],[" "," ","O","O","X"," "," "," "],[" "," "," ","X","X"," "," "," "],[" ","O","O","O"," "," "," "," "],[" "," "," ","O"," "," "," "," "],[" "," "," "," "," "," "," "," "]],[[" "," "," "," "," "," "," "," "],[" "," "," "," "," "," "," "," "],[" "," "," "," "," ","X"," "," "],[" "," ","O","O","X"," "," "," "],[" "," "," ","X","X"," "," "," "],[" ","O","O","X"," "," "," "," "],[" "," "," ","X"," "," "," "," "],[" "," "," ","X"," "," "," "," "]],[[" "," "," "," "," "," "," "," "],[" "," "," "," "," "," "," "," "],[" "," "," "," "," ","X"," "," "],[" "," ","O","O","X"," "," "," "],[" "," "," ","O","X"," "," "," "],[" ","O","O","O","O"," "," "," "],[" "," "," ","X"," "," "," "," "],[" "," "," ","X"," "," "," "," "]],[[" "," "," "," "," "," "," "," "],[" "," "," "," "," "," "," "," "],[" "," "," "," "," ","X"," "," "],[" "," ","O","O","X"," "," "," "],[" "," "," ","O","X"," "," "," "],[" ","O","O","O","X"," "," "," "],[" "," "," ","X","X"," "," "," "],[" "," "," ","X"," "," "," "," "]],[[" "," "," "," "," "," "," "," "],[" "," "," "," "," "," "," "," "],[" "," "," "," "," ","X"," "," "],[" "," ","O","O","X"," "," "," "],[" "," "," ","O","O"," "," "," "],[" ","O","O","O","O","O"," "," "],[" "," "," ","X","X"," "," "," "],[" "," "," ","X"," "," "," "," "]],[[" "," "," "," "," "," "," "," "],[" "," "," "," "," "," "," "," "],[" "," "," "," "," ","X"," "," "],[" "," ","O","O","X"," "," "," "],[" "," "," ","O","O","X"," "," "],[" ","O","O","O","X","O"," "," "],[" "," "," ","X","X"," "," "," "],[" "," "," ","X"," "," "," "," "]],[[" "," "," "," "," "," "," "," "],[" "," "," "," "," "," "," "," "],[" "," "," "," "," ","X"," "," "],[" "," ","O","O","X"," "," "," "],[" "," "," ","O","O","X"," "," "],[" ","O","O","O","X","O"," "," "],[" "," "," ","X","O"," "," "," "],[" "," "," ","X"," ","O"," "," "]],[[" "," "," "," "," "," "," "," "],[" "," "," "," "," "," "," "," "],[" "," "," "," "," ","X"," "," "],[" "," ","O","O","X"," "," "," "],[" "," "," ","O","O","X","X"," "],[" ","O","O","O","X","X"," "," "],[" "," "," ","X","X"," "," "," "],[" "," "," ","X"," ","O"," "," "]],[[" "," "," "," "," "," "," "," "],[" "," "," "," "," "," ","O"," "],[" "," "," "," "," ","O"," "," "],[" "," ","O","O","O"," "," "," "],[" "," "," ","O","O","X","X"," "],[" ","O","O","O","X","X"," "," "],[" "," "," ","X","X"," "," "," "],[" "," "," ","X"," ","O"," "," "]],[[" "," "," "," "," "," "," "," "],[" "," "," "," "," "," ","O"," "],[" "," "," ","X"," ","O"," "," "],[" "," ","O","X","X"," "," "," "],[" "," "," ","X","O","X","X"," "],[" ","O","O","X","X","X"," "," "],[" "," "," ","X","X"," "," "," "],[" "," "," ","X"," ","O"," "," "]],[[" "," "," "," "," "," "," "," "],[" "," "," "," "," "," ","O"," "],[" "," "," ","X"," ","O"," "," "],[" "," ","O","X","X"," "," "," "],[" "," "," ","X","O","O","O","O"],[" ","O","O","X","X","X"," "," "],[" "," "," ","X","X"," "," "," "],[" "," "," ","X"," ","O"," "," "]],[[" "," "," "," "," "," "," "," "],[" "," "," "," "," "," ","O"," "],[" "," "," ","X"," ","O"," "," "],[" ","X","X","X","X"," "," "," "],[" "," "," ","X","O","O","O","O"],[" ","O","O","X","X","X"," "," "],[" "," "," ","X","X"," "," "," "],[" "," "," ","X"," ","O"," "," "]],[[" "," "," "," "," "," "," "," "],[" "," "," "," "," "," ","O"," "],[" "," "," ","X"," ","O"," "," "],[" ","X","X","X","X"," "," "," "],[" "," "," ","X","O","O","O","O"],[" ","O","O","O","X","X"," "," "],[" "," ","O","X","X"," "," "," "],[" "," "," ","X"," ","O"," "," "]],[[" "," "," "," "," "," "," "," "],[" "," "," "," "," "," ","O"," "],[" "," "," ","X"," ","O"," "," "],[" ","X","X","X","X"," "," "," "],[" ","X"," ","X","O","O","O","O"],[" ","O","X","O","X","X"," "," "],[" "," ","O","X","X"," "," "," "],[" "," "," ","X"," ","O"," "," "]],[[" "," "," "," "," "," "," "," "],[" "," "," "," "," "," ","O"," "],[" "," ","O","X"," ","O"," "," "],[" ","X","X","O","X"," "," "," "],[" ","X"," ","X","O","O","O","O"],[" ","O","X","O","X","X"," "," "],[" "," ","O","X","X"," "," "," "],[" "," "," ","X"," ","O"," "," "]],[[" "," "," "," "," "," "," ","X"],[" "," "," "," "," "," ","X"," "],[" "," ","O","X"," ","X"," "," "],[" ","X","X","O","X"," "," "," "],[" ","X"," ","X","O","O","O","O"],[" ","O","X","O","X","X"," "," "],[" "," ","O","X","X"," "," "," "],[" "," "," ","X"," ","O"," "," "]],[[" "," "," "," "," "," "," ","X"],[" "," "," "," "," "," ","X"," "],[" "," ","O","X"," ","X"," "," "],[" ","O","X","O","X"," "," "," "],["O","X"," ","X","O","O","O","O"],[" ","O","X","O","X","X"," "," "],[" "," ","O","X","X"," "," "," "],[" "," "," ","X"," ","O"," "," "]],[[" "," "," "," "," "," "," ","X"],[" ","X"," "," "," "," ","X"," "],[" "," ","X","X"," ","X"," "," "],[" ","O","X","X","X"," "," "," "],["O","X"," ","X","X","O","O","O"],[" ","O","X","O","X","X"," "," "],[" "," ","O","X","X"," "," "," "],[" "," "," ","X"," ","O"," "," "]],[[" "," "," "," "," "," "," ","X"],[" ","X"," "," "," "," ","X"," "],[" "," ","X","X"," ","X"," "," "],[" ","O","X","X","X"," "," "," "],["O","X"," ","X","X","O","O","O"],[" ","O","X","O","O","O","O"," "],[" "," ","O","X","X"," "," "," "],[" "," "," ","X"," ","O"," "," "]],[[" "," "," "," "," "," "," ","X"],[" ","X"," "," "," "," ","X"," "],[" "," ","X","X"," ","X"," "," "],[" ","O","X","X","X"," ","X"," "],["O","X"," ","X","X","X","O","O"],[" ","O","X","O","X","O","O"," "],[" "," ","O","X","X"," "," "," "],[" "," "," ","X"," ","O"," "," "]],[[" "," "," "," "," "," "," ","X"],[" ","X"," "," "," "," ","X"," "],[" "," ","X","X"," ","X","O"," "],[" ","O","X","X","X"," ","O"," "],["O","X"," ","X","X","X","O","O"],[" ","O","X","O","X","O","O"," "],[" "," ","O","X","X"," "," "," "],[" "," "," ","X"," ","O"," "," "]],[[" "," "," "," "," "," "," ","X"],[" ","X"," "," "," "," ","X"," "],[" "," ","X","X"," ","X","O"," "],[" ","O","X","X","X"," ","O"," "],["O","X"," ","X","X","X","O","O"],[" ","O","X","O","X","X","X","X"],[" "," ","O","X","X"," "," "," "],[" "," "," ","X"," ","O"," "," "]],[[" "," "," "," "," "," "," ","X"],[" ","X"," "," "," "," ","X"," "],[" "," ","X","X"," ","X","O"," "],[" ","O","X","X","X"," ","O"," "],["O","X"," ","X","X","X","O","O"],[" ","O","X","O","X","X","X","O"],[" "," ","O","X","X"," "," ","O"],[" "," "," ","X"," ","O"," "," "]],[[" "," "," "," "," "," "," ","X"],[" ","X"," "," "," "," ","X"," "],[" "," ","X","X"," ","X","O"," "],[" ","O","X","X","X"," ","O"," "],["O","X"," ","X","X","X","O","O"],[" ","O","X","O","X","X","X","O"],[" "," ","X","X","X"," "," ","O"],[" "," ","X","X"," ","O"," "," "]],[[" "," "," "," "," "," "," ","X"],[" ","X"," "," "," "," ","X"," "],[" "," ","X","X"," ","X","O"," "],[" ","O","X","X","X"," ","O"," "],["O","O","O","O","O","O","O","O"],[" ","O","X","O","X","X","X","O"],[" "," ","X","X","X"," "," ","O"],[" "," ","X","X"," ","O"," "," "]],[[" "," "," "," "," "," "," ","X"],[" ","X"," "," "," "," ","X"," "],[" "," ","X","X"," ","X","X","X"],[" ","O","X","X","X"," ","X"," "],["O","O","O","O","O","X","O","O"],[" ","O","X","O","X","X","X","O"],[" "," ","X","X","X"," "," ","O"],[" "," ","X","X"," ","O"," "," "]],[[" "," "," "," "," "," "," ","X"],[" ","X"," ","O"," "," ","X"," "],[" "," ","O","O"," ","X","X","X"],[" ","O","X","O","X"," ","X"," "],["O","O","O","O","O","X","O","O"],[" ","O","X","O","X","X","X","O"],[" "," ","X","X","X"," "," ","O"],[" "," ","X","X"," ","O"," "," "]],[[" "," "," "," "," "," "," ","X"],[" ","X"," ","O"," "," ","X"," "],[" "," ","O","O"," ","X","X","X"],[" ","O","X","O","X"," ","X"," "],["O","X","O","O","O","X","O","O"],["X","X","X","O","X","X","X","O"],[" "," ","X","X","X"," "," ","O"],[" "," ","X","X"," ","O"," "," "]],[[" "," "," "," "," "," "," ","X"],[" ","X"," ","O"," "," ","X"," "],[" "," ","O","O"," ","X","X","X"],[" ","O","X","O","X"," ","X"," "],["O","X","O","O","O","X","O","O"],["X","X","X","O","X","X","X","O"],[" "," ","O","X","X"," "," ","O"],[" ","O","X","X"," ","O"," "," "]],[[" "," "," "," "," "," "," ","X"],[" ","X"," ","O"," "," ","X"," "],[" "," ","O","O"," ","X","X","X"],[" ","O","X","O","X"," ","X"," "],["O","X","O","O","O","X","O","O"],["X","X","X","O","X","X","X","O"],[" "," ","O","X","X"," "," ","O"],["X","X","X","X"," ","O"," "," "]],[["O"," "," "," "," "," "," ","X"],[" ","O"," ","O"," "," ","X"," "],[" "," ","O","O"," ","X","X","X"],[" ","O","X","O","X"," ","X"," "],["O","X","O","O","O","X","O","O"],["X","X","X","O","X","X","X","O"],[" "," ","O","X","X"," "," ","O"],["X","X","X","X"," ","O"," "," "]],[["O"," "," ","X"," "," "," ","X"],[" ","O"," ","X"," "," ","X"," "],[" "," ","O","X"," ","X","X","X"],[" ","O","X","X","X"," ","X"," "],["O","X","O","X","O","X","O","O"],["X","X","X","X","X","X","X","O"],[" "," ","O","X","X"," "," ","O"],["X","X","X","X"," ","O"," "," "]],[["O"," "," ","X"," "," "," ","X"],[" ","O"," ","X"," "," ","X"," "],[" "," ","O","X"," ","X","X","X"],[" ","O","X","X","X"," ","X"," "],["O","X","O","X","O","X","O","O"],["X","X","X","X","O","X","X","O"],[" "," ","O","X","O"," "," ","O"],["X","X","X","X","O","O"," "," "]],[["O"," "," ","X"," "," "," ","X"],[" ","O"," ","X"," "," ","X"," "],[" "," ","O","X"," ","X","X","X"],[" ","O","X","X","X"," ","X"," "],["O","X","O","X","O","X","O","O"],["X","X","X","X","X","X","X","O"],[" "," ","O","X","X","X"," ","O"],["X","X","X","X","O","O"," "," "]],[["O"," "," ","X"," "," ","O","X"],[" ","O"," ","X"," "," ","O"," "],[" "," ","O","X"," ","X","O","X"],[" ","O","X","X","X"," ","O"," "],["O","X","O","X","O","X","O","O"],["X","X","X","X","X","X","X","O"],[" "," ","O","X","X","X"," ","O"],["X","X","X","X","O","O"," "," "]],[["O"," "," ","X"," "," ","O","X"],[" ","O"," ","X"," "," ","O"," "],[" "," ","O","X"," ","X","O","X"],[" ","O","X","X","X"," ","O"," "],["O","X","O","X","O","X","O","O"],["X","X","X","X","X","X","X","O"],[" ","X","X","X","X","X"," ","O"],["X","X","X","X","O","O"," "," "]],[["O"," "," ","X"," "," ","O","X"],[" ","O"," ","X"," "," ","O"," "],[" "," ","O","X"," ","X","O","X"],[" ","O","O","O","O","O","O"," "],["O","X","O","X","O","O","O","O"],["X","X","X","X","X","O","X","O"],[" ","X","X","X","X","O"," ","O"],["X","X","X","X","O","O"," "," "]],[["O"," "," ","X"," "," ","O","X"],[" ","O","X","X"," "," ","O"," "],[" "," ","X","X"," ","X","O","X"],[" ","O","X","O","O","O","O"," "],["O","X","X","X","O","O","O","O"],["X","X","X","X","X","O","X","O"],[" ","X","X","X","X","O"," ","O"],["X","X","X","X","O","O"," "," "]],[["O"," "," ","X"," "," ","O","X"],[" ","O","O","O","O"," ","O"," "],[" "," ","X","X"," ","O","O","X"],[" ","O","X","O","O","O","O"," "],["O","X","X","X","O","O","O","O"],["X","X","X","X","X","O","X","O"],[" ","X","X","X","X","O"," ","O"],["X","X","X","X","O","O"," "," "]],[["O"," "," ","X"," ","X","X","X"],[" ","O","O","O","X"," ","X"," "],[" "," ","X","X"," ","O","O","X"],[" ","O","X","O","O","O","O"," "],["O","X","X","X","O","O","O","O"],["X","X","X","X","X","O","X","O"],[" ","X","X","X","X","O"," ","O"],["X","X","X","X","O","O"," "," "]],[["O"," "," ","X"," ","X","X","X"],[" ","O","O","O","X"," ","X"," "],[" "," ","X","X"," ","O","O","X"],[" ","O","X","O","O","O","O"," "],["O","X","X","X","O","O","O","O"],["X","X","X","X","X","O","O","O"],[" ","X","X","X","X","O","O","O"],["X","X","X","X","O","O"," "," "]],[["O"," "," ","X"," ","X","X","X"],[" ","O","O","O","X"," ","X"," "],["X"," ","X","X"," ","O","O","X"],[" ","X","X","O","O","O","O"," "],["O","X","X","X","O","O","O","O"],["X","X","X","X","X","O","O","O"],[" ","X","X","X","X","O","O","O"],["X","X","X","X","O","O"," "," "]],[["O"," "," ","X"," ","X","X","X"],[" ","O","O","O","O","O","X"," "],["X"," ","X","X"," ","O","O","X"],[" ","X","X","O","O","O","O"," "],["O","X","X","X","O","O","O","O"],["X","X","X","X","X","O","O","O"],[" ","X","X","X","X","O","O","O"],["X","X","X","X","O","O"," "," "]],[["O"," "," ","X","X","X","X","X"],[" ","O","O","X","O","O","X"," "],["X"," ","X","X"," ","O","O","X"],[" ","X","X","O","O","O","O"," "],["O","X","X","X","O","O","O","O"],["X","X","X","X","X","O","O","O"],[" ","X","X","X","X","O","O","O"],["X","X","X","X","O","O"," "," "]],[["O"," "," ","X","X","X","X","X"],[" ","O","O","X","O","O","X"," "],["X"," ","X","X"," ","O","O","X"],["O","O","O","O","O","O","O"," "],["O","O","X","X","O","O","O","O"],["X","X","O","X","X","O","O","O"],[" ","X","X","O","X","O","O","O"],["X","X","X","X","O","O"," "," "]],[["O"," "," ","X","X","X","X","X"],[" ","O","X","X","O","O","X"," "],["X","X","X","X"," ","O","O","X"],["O","X","X","O","O","O","O"," "],["O","X","X","X","O","O","O","O"],["X","X","O","X","X","O","O","O"],[" ","X","X","O","X","O","O","O"],["X","X","X","X","O","O"," "," "]],[["O"," "," ","X","X","X","X","X"],["O","O","X","X","O","O","X"," "],["O","O","X","X"," ","O","O","X"],["O","X","O","O","O","O","O"," "],["O","X","X","O","O","O","O","O"],["X","X","O","X","O","O","O","O"],[" ","X","X","O","X","O","O","O"],["X","X","X","X","O","O"," "," "]],[["O"," "," ","X","X","X","X","X"],["O","O","X","X","O","O","X"," "],["O","O","X","X"," ","O","O","X"],["O","X","O","X","O","O","O"," "],["O","X","X","O","X","O","O","O"],["X","X","O","X","O","X","O","O"],[" ","X","X","O","X","O","X","O"],["X","X","X","X","O","O"," ","X"]],[["O","O"," ","X","X","X","X","X"],["O","O","O","X","O","O","X"," "],["O","O","X","O"," ","O","O","X"],["O","X","O","X","O","O","O"," "],["O","X","X","O","X","O","O","O"],["X","X","O","X","O","X","O","O"],[" ","X","X","O","X","O","X","O"],["X","X","X","X","O","O"," ","X"]],[["O","O"," ","X","X","X","X","X"],["O","O","O","X","O","X","X"," "],["O","O","X","O"," ","O","X","X"],["O","X","O","X","X","X","X","X"],["O","X","X","O","X","O","X","X"],["X","X","O","X","O","X","O","X"],[" ","X","X","O","X","O","X","X"],["X","X","X","X","O","O"," ","X"]],[["O","O"," ","X","X","X","X","X"],["O","O","O","X","O","X","X"," "],["O","O","X","O"," ","O","X","X"],["O","X","O","X","X","X","X","X"],["O","X","X","O","X","O","X","X"],["O","X","O","X","O","X","O","X"],["O","O","O","O","X","O","X","X"],["X","X","X","X","O","O"," ","X"]],[["O","O"," ","X","X","X","X","X"],["O","O","O","X","O","X","X"," "],["O","O","X","O"," ","O","X","X"],["O","X","O","X","X","X","X","X"],["O","X","X","O","X","O","X","X"],["O","X","O","X","O","X","O","X"],["O","O","O","O","X","O","X","X"],["X","X","X","X","X","X","X","X"]],[["O","O"," ","X","X","X","X","X"],["O","O","O","X","O","O","O","O"],["O","O","X","O"," ","O","O","X"],["O","X","O","X","X","O","X","X"],["O","X","X","O","O","O","X","X"],["O","X","O","O","O","X","O","X"],["O","O","O","O","X","O","X","X"],["X","X","X","X","X","X","X","X"]],[["O","O","X","X","X","X","X","X"],["O","O","X","X","O","O","O","O"],["O","O","X","O"," ","O","O","X"],["O","X","O","X","X","O","X","X"],["O","X","X","O","O","O","X","X"],["O","X","O","O","O","X","O","X"],["O","O","O","O","X","O","X","X"],["X","X","X","X","X","X","X","X"]]]}}
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
