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

## Install Helm

1. Download helm according to [Helm Install](https://helm.sh/docs/intro/install/)

```
wget https://get.helm.sh/helm-v3.0.0-linux-amd64.tar.gz
```

2. Untar the binaries.

```
tar -zxvf helm-v3.0.0-linux-amd64.tar.gz
```

3. Move it to the usr/local/bin

```
sudo mv linux-amd64/helm /usr/local/bin/helm
```

4. Install the stable repos:

```
helm repo add stable https://kubernetes-charts.storage.googleapis.com/
```

5. Search for redis:

```
helm search repo redis
```

6. Update repo:

```
ubuntu@master-1:~$ helm repo update
Hang tight while we grab the latest from your chart repositories...
...Successfully got an update from the "stable" chart repository
Update Complete. ⎈ Happy Helming!⎈
```

## Install Redis

1. Download default values, read about them [Github helm Redis](https://github.com/helm/charts/tree/master/stable/redis):

```
wget https://raw.githubusercontent.com/helm/charts/master/stable/redis/values.yaml
```

2. I updated the `slaveCount` value to 3 and then uncommented the master.persistence.storageClass value of "-" as well as the slave.persistence.storageClass

3. Create PV

```
apiVersion: v1
kind: PersistentVolume
metadata:
  labels:
    type: local
  name: redis-master-pv-volume
spec:
  accessModes:
  - ReadWriteOnce
  capacity:
    storage: 8Gi
  hostPath:
    path: /data
  persistentVolumeReclaimPolicy: Retain
---
apiVersion: v1
kind: PersistentVolume
metadata:
  labels:
    type: local
  name: redis-slave-0-pv-volume
spec:
  accessModes:
  - ReadWriteOnce
  capacity:
    storage: 8Gi
  hostPath:
    path: /data
  persistentVolumeReclaimPolicy: Retain
---
apiVersion: v1
kind: PersistentVolume
metadata:
  labels:
    type: local
  name: redis-slave-1-pv-volume
spec:
  accessModes:
  - ReadWriteOnce
  capacity:
    storage: 8Gi
  hostPath:
    path: /data
  persistentVolumeReclaimPolicy: Retain
---
apiVersion: v1
kind: PersistentVolume
metadata:
  labels:
    type: local
  name: redis-slave-2-pv-volume
spec:
  accessModes:
  - ReadWriteOnce
  capacity:
    storage: 8Gi
  hostPath:
    path: /data
  persistentVolumeReclaimPolicy: Retain
```

4. Install Redis:

```
ubuntu@master-1:~$ helm install othello-redis stable/redis -f values.yaml
NAME: othello-redis
LAST DEPLOYED: Wed Dec  4 13:38:17 2019
NAMESPACE: default
STATUS: deployed
REVISION: 1
TEST SUITE: None
NOTES:
** Please be patient while the chart is being deployed **
Redis can be accessed via port 6379 on the following DNS names from within your cluster:

othello-redis-master.default.svc.cluster.local for read/write operations
othello-redis-slave.default.svc.cluster.local for read-only operations


To get your password run:

    export REDIS_PASSWORD=$(kubectl get secret --namespace default othello-redis -o jsonpath="{.data.redis-password}" | base64 --decode)

To connect to your Redis server:

1. Run a Redis pod that you can use as a client:

   kubectl run --namespace default othello-redis-client --rm --tty -i --restart='Never' \
    --env REDIS_PASSWORD=$REDIS_PASSWORD \
   --image docker.io/bitnami/redis:5.0.7-debian-9-r12 -- bash

2. Connect using the Redis CLI:
   redis-cli -h othello-redis-master -a $REDIS_PASSWORD
   redis-cli -h othello-redis-slave -a $REDIS_PASSWORD

To connect to your database from outside the cluster execute the following commands:

    kubectl port-forward --namespace default svc/othello-redis-master 6379:6379 &
    redis-cli -h 127.0.0.1 -p 6379 -a $REDIS_PASSWORD
```

# Troubleshooting

When deploying redis I had issues with the containers in CrashLoopBackOff status:

```
kubectl logs othello-redis-master-0
 20:40:08.40 INFO  ==> ** Starting Redis **
1:C 04 Dec 2019 20:40:08.408 # oO0OoO0OoO0Oo Redis is starting oO0OoO0OoO0Oo
1:C 04 Dec 2019 20:40:08.408 # Redis version=5.0.7, bits=64, commit=00000000, modified=0, pid=1, just started
1:C 04 Dec 2019 20:40:08.408 # Configuration loaded
1:M 04 Dec 2019 20:40:08.410 # Can't open the append-only file: Permission denied
```

I had to log into each node, create the /data folder that was used in the PV and then modify permissions using:

```
sudo mkdir /data
sudo chown 1001:1001 /data
```

# Testing manager-controller

1. Peers method.

2. Test the visited post method, should create visited keys with string type:

```
get "visited:                           OX      XXX                          "
"1"
```

curl command:

```
ubuntu@master-1:~/github/othello$ curl -i -d '["                          XXX      XO                           ","                           OX      XXX                          ","                   X       XX      XO                           ","                           OX      XX       X                   "]' -H "Content-Type: application/json" -X POST http://10.101.123.250:9090/api/v1/state
HTTP/1.1 201 Created
Date: Fri, 06 Dec 2019 17:43:24 GMT
Content-Length: 270
Content-Type: text/plain; charset=utf-8

["                          XXX      XO                           ","                           OX      XXX                          ","                   X       XX      XO                           ","                           OX      XX       X                   "]
```

3. Test the statemap post method, should create parent maps sets:

```
smembers "parentMap:                           OX      XXX                          "
1) "                           OX      XO                           "
2) "                          XOX      XO                           "
```

curl commands:

```
ubuntu@master-1:~/github/othello$ curl -i -d '[{"child":"                           OX      XXX                          ","parent":"                           OX      XO                           "},{"child":"                   X       XX      XO                           ","parent":"                           OX      XO                           "}]' -H "Content-Type: application/json" -X POST http://10.105.249.243:9090/api/v1/statemap
HTTP/1.1 201 Created
Date: Fri, 06 Dec 2019 23:39:23 GMT
Content-Length: 308
Content-Type: text/plain; charset=utf-8

[{"child":"                           OX      XXX                          ","parent":"                           OX      XO                           "},{"child":"                   X       XX      XO                           ","parent":"                           OX      XO                           "}]
ubuntu@master-1:~/github/othello$ curl -i -d '[{"child":"                           OX      XXX                          ","parent":"                          XOX      XO                           "},{"child":"                   X       XX      XO                           ","parent":"                          XOX      XO                           "}]' -H "Content-Type: application/json" -X POST http://10.105.249.243:9090/api/v1/statemap
HTTP/1.1 201 Created
Date: Fri, 06 Dec 2019 23:40:58 GMT
Content-Length: 308
Content-Type: text/plain; charset=utf-8

[{"child":"                           OX      XXX                          ","parent":"                          XOX      XO                           "},{"child":"                   X       XX      XO                           ","parent":"                          XOX      XO                           "}]
```

4. Test the solution post method, should create a hm key from redis and a list item:

```
hgetall "solution:XXXXXXXXXOOXOOXXXOOOXOXXXOXXXXXXXOOXXOXXXXXXXXOXXXOOOOXXXXXXXXXX"
1) "X"
2) "47"
3) "O"
4) "17"
```

```
lrange "x_wins" 0 1
1) "XXXXXXXXXOOXOOXXXOOOXOXXXOXXXXXXXOOXXOXXXXXXXXOXXXOOOOXXXXXXXXXX"
```

curl command: 

```
ubuntu@master-1:~/github/othello$ curl -i -d '[ [ [ "X", "X", "X", "X", "X", "X", "X", "X" ], [ "X", "O", "O", "X", "O", "O", "X", "X" ], [ "X", "O", "O", "O", "X", "O", "X", "X" ], [ "X", "O", "X", "X", "X", "X", "X", "X" ], [ "X", "O", "O", "X", "O", "O", "X", "X" ], [ "X", "X", "X", "X", "X", "O", "O", "X" ], [ "X", "X", "O", "O", "O", "O", "O", "O" ], [ "X", "X", "X", "X", "X", "X", "X", " " ] ], [ [ "X", "X", "X", "X", "X", "X", "X", "X" ], [ "X", "O", "O", "X", "O", "O", "X", "X" ], [ "X", "O", "O", "O", "X", "O", "X", "X" ], [ "X", "O", "X", "X", "X", "X", "X", "X" ], [ "X", "O", "O", "X", "X", "O", "X", "X" ], [ "X", "X", "X", "X", "X", "X", "O", "X" ], [ "X", "X", "O", "O", "O", "O", "X", "X" ], [ "X", "X", "X", "X", "X", "X", "X", "X" ] ]]' -H "Content-Type: application/json" -X POST http://10.105.249.243:9090/api/v1/solution
HTTP/1.1 201 Created
Date: Fri, 06 Dec 2019 23:44:40 GMT
Content-Length: 550
Content-Type: text/plain; charset=utf-8

[[["X","X","X","X","X","X","X","X"],["X","O","O","X","O","O","X","X"],["X","O","O","O","X","O","X","X"],["X","O","X","X","X","X","X","X"],["X","O","O","X","O","O","X","X"],["X","X","X","X","X","O","O","X"],["X","X","O","O","O","O","O","O"],["X","X","X","X","X","X","X"," "]],[["X","X","X","X","X","X","X","X"],["X","O","O","X","O","O","X","X"],["X","O","O","O","X","O","X","X"],["X","O","X","X","X","X","X","X"],["X","O","O","X","X","O","X","X"],["X","X","X","X","X","X","O","X"],["X","X","O","O","O","O","X","X"],["X","X","X","X","X","X","X","X"]]]
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