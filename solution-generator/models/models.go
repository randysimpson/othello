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
  "os"
  "strconv"
  "log"
)

type Info struct {
  Ip string `json:"ip"`
  ManagerHost string
  ManagerPort int
  RedisRO string
  RedisPort int
}

var info Info

func init() {
  info.Ip = os.Getenv("POD_IP")
  info.ManagerHost = os.Getenv("MGR_HOST")
  port, err := strconv.Atoi(os.Getenv("MGR_PORT"))
  if err != nil {
    log.Printf("error: %+v", err)
  }

  info.ManagerPort = port
  info.RedisRO = os.Getenv("REDIS_RO")
  redisPort, err := strconv.Atoi(os.Getenv("REDIS_PORT"))
  if err != nil {
    log.Printf("error: %+v", err)
  }

  info.RedisPort = redisPort

  Register()

  SetupPool()
}

func GetInfo() Info {
  return info
}
