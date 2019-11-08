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