#!/bin/bash
# script used to create the othello stats.

echo "Setting up server ip variable"

export othello_server_ip=$(kubectl get svc othello-server | grep othello | awk '{split($0, a, " "); print a[3]}')

echo "Launching 100 random vs random games"

for i in {1..100}
do
  curl -d '{"player1":{"ip":"othello-random-ai","port":10000},"player2":{"ip":"othello-random-ai","port":10000}}' -H "Content-Type: application/json" -X POST http://$othello_server_ip:8080/api/v1/games
  echo ""
  sleep 1
done

echo ""
echo "Launching 100 greedy vs random games"

for i in {1..100}
do
  curl -d '{"player1":{"ip":"othello-greedy-ai","port":9000},"player2":{"ip":"othello-random-ai","port":10000}}' -H "Content-Type: application/json" -X POST http://$othello_server_ip:8080/api/v1/games
  echo ""
  sleep 1
done

echo ""
echo "Launching 100 greedy vs greedy games"

for i in {1..100}
do
  curl -d '{"player1":{"ip":"othello-greedy-ai","port":9000},"player2":{"ip":"othello-greedy-ai","port":9000}}' -H "Content-Type: application/json" -X POST http://$othello_server_ip:8080/api/v1/games
  echo ""
  sleep 1
done

echo ""
echo "Launching 100 custom vs random games"

for i in {1..100}
do
  curl -d '{"player1":{"ip":"othello-custom-ai","port":9000},"player2":{"ip":"othello-random-ai","port":10000}}' -H "Content-Type: application/json" -X POST http://$othello_server_ip:8080/api/v1/games
  echo ""
  sleep 1
done

echo ""
echo "Launching 100 custom vs greedy games"

for i in {1..100}
do
  curl -d '{"player1":{"ip":"othello-custom-ai","port":9000},"player2":{"ip":"othello-greedy-ai","port":9000}}' -H "Content-Type: application/json" -X POST http://$othello_server_ip:8080/api/v1/games
  echo ""
  sleep 1
done

echo ""
echo "Launching 100 custom vs custom games"

for i in {1..100}
do
  curl -d '{"player1":{"ip":"othello-custom-ai","port":9000},"player2":{"ip":"othello-custom-ai","port":9000}}' -H "Content-Type: application/json" -X POST http://$othello_server_ip:8080/api/v1/games
  echo ""
  sleep 1
done

echo ""
echo "Complete"
