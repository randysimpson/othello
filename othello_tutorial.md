# Create

1. Create Folder
2. Initialize npm project using `npm init` command:

```
C:\Users\rsimpson\Documents\github\othello\server>npm init
This utility will walk you through creating a package.json file.
It only covers the most common items, and tries to guess sensible defaults.

See `npm help json` for definitive documentation on these fields
and exactly what they do.

Use `npm install <pkg>` afterwards to install a package and
save it as a dependency in the package.json file.

Press ^C at any time to quit.
package name: (server)
version: (1.0.0)
description:
entry point: (index.js) app.js
test command:
git repository: randysimpson/othello
keywords: othello
author: Randy Simpson
license: (ISC) MIT
About to write to C:\Users\rsimpson\Documents\github\othello\server\package.json:

{
  "name": "server",
  "version": "1.0.0",
  "description": "",
  "main": "app.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "repository": {
    "type": "git",
    "url": "git+https://github.com/randysimpson/othello.git"
  },
  "keywords": [
    "othello"
  ],
  "author": "Randy Simpson",
  "license": "MIT",
  "bugs": {
    "url": "https://github.com/randysimpson/othello/issues"
  },
  "homepage": "https://github.com/randysimpson/othello#readme"
}


Is this ok? (yes)


   ╭──────────────────────────────────────╮
   │                                      │
   │   Update available 5.6.0 → 6.13.0    │
   │       Run npm i npm to update        │
   │                                      │
   ╰──────────────────────────────────────╯
```

3. Update package.json file to include start script by adding `"start": "node app.js"` to scripts attribute:

```
"scripts": {
  "test": "echo \"Error: no test specified\" && exit 1",
  "start": "node app.js"
},
```


4. Install dependencies, `npm install express body-parser --save`:

```
C:\Users\rsimpson\Documents\github\othello\server>npm install express body-parser --save
npm notice created a lockfile as package-lock.json. You should commit this file.
npm WARN server@1.0.0 No description

+ body-parser@1.19.0
+ express@4.17.1
added 50 packages in 6.46s
```

5. Create `app.js` file, this is entry point for application:

```
console.log("Here");
```

6. To run application issue `npm start`.

## Create UI

1. Issue create-react-app command:

```
C:\Users\rsimpson\Documents\github\othello>npx create-react-app othello-ui
npx: installed 1 in 3.919s
Path must be a string. Received undefined
npx: installed 91 in 16.356s
C:\Users\rsimpson\AppData\Roaming\npm-cache\_npx\11500\node_modules\create-react-app\index.js

Creating a new React app in C:\Users\rsimpson\Documents\github\othello\othello-ui.

Installing packages. This might take a couple of minutes.
Installing react, react-dom, and react-scripts...


> core-js@2.6.10 postinstall C:\Users\rsimpson\Documents\github\othello\othello-ui\node_modules\babel-runtime\node_modules\core-js
> node postinstall || echo "ignore"


> core-js@3.2.1 postinstall C:\Users\rsimpson\Documents\github\othello\othello-ui\node_modules\core-js
> node scripts/postinstall || echo "ignore"

+ react-dom@16.12.0
+ react@16.12.0
+ react-scripts@3.2.0
added 1476 packages in 133.045s

Success! Created othello-ui at C:\Users\rsimpson\Documents\github\othello\othello-ui
Inside that directory, you can run several commands:

  npm start
    Starts the development server.

  npm run build
    Bundles the app into static files for production.

  npm test
    Starts the test runner.

  npm run eject
    Removes this tool and copies build dependencies, configuration files
    and scripts into the app directory. If you do this, you can’t go back!

We suggest that you begin by typing:

  cd othello-ui
  npm start

Happy hacking!
```

2. Add css:

```
npm install @clr/ui --save
```

```
npm install @clr/icons --save
```

```
npm install @webcomponents/custom-elements --save
```

3. Add to index.js:

```
import '@clr/ui/clr-ui.min.css';
import '@clr/icons/clr-icons.min.css';
import '@webcomponents/custom-elements/custom-elements.min.js';
import '@clr/icons/clr-icons.min.js';
```

4. Install redux

```
npm install redux redux-thunk react-redux --save
```

# Build

1. To build docker image on linux amd64 issue:

```
docker build -t randysimpson/othello:1.0-server-amd64 .
```

2. Push it to docker hub.

```
docker push randysimpson/othello:1.0-server-amd64
```

3. Build on Raspberry Pi arm arch:

```
docker build -t randysimpson/othello:1.0-server-arm .
```

4. Push to docker

```
docker push randysimpson/othello:1.0-server-arm
```

5. If docker is not ready for experimental features:

```
To enable the manifest feature, the experimental CLI options needs to be set in the config file in .docker home folder. Here’s how your config.json file should look like
{
   "experimental": "enabled",
   "credsStore": "wincred",
   "auths": {
       "https://index.docker.io/v1/": {}
    }
}
```

6. Create `latest` edition that will be available for download from hub.docker:

```
docker manifest create randysimpson:othello:1.0-server-latest randysimpson/othello:1.0-server-arm randysimpson/othello:1.0-server-amd64
```

7. Push to hub.docker:

```
docker manifest push randysimpson:othello:1.0-server-latest
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
