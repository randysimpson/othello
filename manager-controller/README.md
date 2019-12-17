# Manager Controller

![Context Diagram](https://github.com/randysimpson/othello/raw/redis/context.PNG "Context Diagram")

## Description

The solution-generator containers will check for visited states from the redis read only databases.  The solution-generator is used to generate all possible outcomes of the Othello board play, and send the solved solutions to the master-controller containers for processing/storage.  The manager-controller is used to send the data to the redis read/write database and store the solution's child parent relationships.  The intent behind using microservice architecture is that multiple API calls can be issued and received simultaneously speeding up the time it takes to process all possible solutions.

## Issues

1. The microservice's were not running async, which needed to be investigated.
2. The space in the redis database will run out before all outcomes are achieved.

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
