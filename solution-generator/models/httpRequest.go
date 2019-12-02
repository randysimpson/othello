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
  "net/http"
  "encoding/json"
  "io/ioutil"
  "bytes"
  "github.com/pkg/errors"
  "fmt"
)

func Post(host string, port int, path string, contentType string, body interface{}) (interface{}, error) {
  requestBody, err := json.Marshal(&body)
  if err != nil {
    return nil, errors.Wrap(err, fmt.Sprintf("Error with json of body on Post"))
  }

  url := fmt.Sprintf("http://%s:%d%s", host, port, path)
  response, err := http.Post(url, contentType, bytes.NewBuffer(requestBody))
  if err != nil {
    return nil, errors.Wrap(err, fmt.Sprintf("Error creating post to %s", url))
  }

  defer response.Body.Close()
  responseBody, err := ioutil.ReadAll(response.Body)
  if err != nil {
    return nil, errors.Wrap(err, fmt.Sprintf("Error reading body of response"))
  }

  var result interface{}
  err = json.Unmarshal(responseBody, &result)
  if err != nil {
    return nil, errors.Wrap(err, fmt.Sprintf("Error converting body into json"))
  }

  return result, nil
}
