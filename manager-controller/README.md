# Manager Controller

![Context Diagram](https://github.com/randysimpson/othello/raw/master/context.PNG "Context Diagram")

## Description

The solution-generator containers will register with the manager-controller containers.  Then the solution-generator containers will be used to generate all possible outcomes of the Othello board play, and send the solved solutions to the manager-controller containers for processing/storage.  The manager-controller is used to send the data to the postgres database and store the solution's unigram count/bigram count while keeping the wins/loss/tie statistics.  The intent behind using microservice architecture is that multiple API calls can be issued and received simultaneously speeding up the time it takes to process all possible solutions.

## Issues

1. The microservice's were not running async, which needed to be investigated.
2. Microservices need throttled somehow so that all 10^28 possible states are not sent out in http calls simultaneously
3. Unclear how big the database would need to be.

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
