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

const express = require('express'),
  bodyParser = require('body-parser')

const app = express();
const gamesRoute = require('./routes/games');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const port = process.env.PORT || 8080;        // set our port

//allow for CORS cross orign requests.
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Cache-Control, Pragma, Origin, Authorization, Content-Type, X-Requested-With");
  res.header("Access-Control-Allow-Methods", "GET, PUT, POST");
  next();
})

//define the API
app.use('/api/v1/games', gamesRoute);

app.get('/', (req, res) => res.send('TODO: Api Definition'));

app.use(function (req, res) {
  res.status(404);

  // respond with html page
  if (req.accepts('html')) {
      const html = `
<!doctype html>
<html>
<head>
<title>Othello Server - 404</title>
</head>
<body>
  <div class='container'>
      <h3>404 Error the page was not found.</h3>
  </div>
</body>
</html>`;
      res.send(html);
      return;
  }

  // respond with json
  if (req.accepts('json')) {
      res.send({ error: 'Not found' });
      return;
  }

  // default to plain-text. send()
  res.type('txt').send('Not found');
});

app.listen(port, () => console.log(`API ruuning on port ${port}!`));
