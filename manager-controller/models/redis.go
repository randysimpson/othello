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
	"fmt"
	"log"
	"github.com/gomodule/redigo/redis"
	"time"
)

var pool *redis.Pool

func SetupPool(host string, port int, password string) {
	url := fmt.Sprintf("%s:%d", host, port)
	pool = &redis.Pool{
		MaxIdle:     10,
		IdleTimeout: 240 * time.Second,
		Dial: func() (redis.Conn, error) {
			return redis.Dial("tcp", url, redis.DialPassword(password))
		},
	}
}

func AddStates(states []string) {
	conn := pool.Get()
	defer conn.Close()

	//setup transaction.
	err := conn.Send("MULTI")
	if err != nil {
		log.Printf("error: %+v", err)
	}

	for _, state := range states {
		key := fmt.Sprintf("visited:%s", state)
		//if it exists increment by 1
		err = conn.Send("SET", key, 1)
		if err != nil {
	    log.Printf("error: %+v", err)
	  }
	}

	//execute transaction
	_, err = conn.Do("EXEC")
	if err != nil {
		log.Printf("error: %+v", err)
	}
}

func AddStateMaping(stateMaping []StateMap) {
	conn := pool.Get()
	defer conn.Close()

	//setup transaction.
	err := conn.Send("MULTI")
	if err != nil {
		log.Printf("error: %+v", err)
	}

	for _, stateMap := range stateMaping {
		key := fmt.Sprintf("parentMap:%s", stateMap.Child)

		err = conn.Send("SADD", key, stateMap.Parent)
		if err != nil {
	    log.Printf("error: %+v", err)
	  }
	}

	//execute transaction
	_, err = conn.Do("EXEC")
	if err != nil {
		log.Printf("error: %+v", err)
	}
}

func AddSolution(state string, score Score) {
	conn := pool.Get()
	defer conn.Close()

	//setup transaction.
	err := conn.Send("MULTI")
	if err != nil {
		log.Printf("error: %+v", err)
	}

	//set a hash with score
	key := fmt.Sprintf("solution:%s", state)
	err = conn.Send("HMSET", key, "X", score.X, "O", score.O)
	if err != nil {
		log.Printf("error: %+v", err)
	}

	result := "o_wins"
	//set a win/tie/loss list of solutions.
	if score.X > score.O {
		result = "x_wins"
	} else if score.X == score.O {
		result = "tie"
	}

	key2 := fmt.Sprintf("%s", result)
	err = conn.Send("LPUSH", key2, state)
	if err != nil {
		log.Printf("error: %+v", err)
	}

	//execute transaction
	_, err = conn.Do("EXEC")
	if err != nil {
		log.Printf("error: %+v", err)
	}

	log.Printf("solution ->")
	log.Printf("state: %+v\n", state)
	log.Printf("score: %+v\n", score)
}

func AddPeer(ip string) {
	conn := pool.Get()
	defer conn.Close()

	//setup transaction.
	err := conn.Send("MULTI")
	if err != nil {
		log.Printf("error: %+v", err)
	}

	key := fmt.Sprintf("peer:%s", ip)
	err = conn.Send("SET", key, 0)
	if err != nil {
		log.Printf("error: %+v", err)
	}

	err = conn.Send("SADD", "peers", ip)
	if err != nil {
		log.Printf("error: %+v", err)
	}

	//execute transaction
	_, err = conn.Do("EXEC")
	if err != nil {
		log.Printf("error: %+v", err)
	}
}

func GetPeers() []Peer {
	var peers []Peer
	conn := pool.Get()
	defer conn.Close()

	ips, err := redis.Strings(conn.Do("SMEMBERS", "peers"))
	if err != nil {
		log.Printf("error: %+v", err)
	}

	for _, ip := range ips {
		key := fmt.Sprintf("peer:%s", ip)
		count, err := redis.Int(conn.Do("GET", key))
		if err != nil {
			log.Printf("error: %+v", err)
		}
		peer := Peer{ip, count}
		peers = append(peers, peer)
	}

	return peers
}

func IncrPeers(peers []Peer) {
	conn := pool.Get()
	defer conn.Close()

	for _, peer := range peers {
		key := fmt.Sprintf("peer:%s", peer.Ip)
		_, err := redis.Int(conn.Do("INCR", key))
		if err != nil {
			log.Printf("error: %+v", err)
		}
	}
}
