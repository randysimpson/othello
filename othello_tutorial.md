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

## HA Proxy

1. Create PV

```
apiVersion: v1
kind: PersistentVolume
metadata:
  labels:
    type: local
  name: data-ha-proxy
spec:
  accessModes:
  - ReadWriteOnce
  capacity:
    storage: 1Gi
  hostPath:
    path: /data
  persistentVolumeReclaimPolicy: Retain
```

2. pvc

```
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  labels:
    component: haproxy
    tier: control-plane
  name: data-ha-proxy
spec:
  accessModes:
  - ReadWriteOnce
  resources:
    requests:
      storage: 1Gi
  volumeMode: Filesystem
  volumeName: data-ha-proxy
```

2. container

```
apiVersion: v1
kind: Pod
metadata:
  labels:
    component: haproxy
    tier: control-plane
  name: haproxy
spec:
  containers:
  - image: haproxy:1.9.4
    name: haproxy
    volumeMounts:
    - name: haproxy-cfg
      mountPath: /usr/local/etc/haproxy/haproxy.cfg
      subPath: haproxy.cfg
    resources: {}
  hostNetwork: true
  volumes:
  - hostPath:
      path: /data
    name: haproxy-cfg
  nodeSelector:
    kubernetes.io/hostname: master-2
status: {}
```

4. haconfig

```
global
defaults
    timeout client        30s
    timeout server        30s
    timeout connect        30s

frontend mgr-api
    bind            0.0.0.0:9090
    mode            tcp
    default_backend        mgr-api

backend mgr-api
   mode tcp
   option tcp-check
   balance roundrobin
   default-server inter 10s downinter 5s rise 2 fall 2 slowstart 60s maxconn 250 maxqueue 256 weight 100

       server mgr-1 10.39.0.1:9090 check
       server mgr-2 10.40.0.2:9090 check
       server mgr-3 10.47.0.1:9090 check

listen stats # Define a listen section called "stats"
  bind 0.0.0.0:9000 # Listen on localhost:9000
  mode http
  stats enable  # Enable stats page
  stats hide-version  # Hide HAProxy version
  stats realm Haproxy\ Statistics  # Title text for popup window
  stats uri /  # Stats URI
```

## Postgres

1. Create PV

```
apiVersion: v1
kind: PersistentVolume
metadata:
  labels:
    type: local
  name: data-postgres-postgresql-0
spec:
  accessModes:
  - ReadWriteOnce
  capacity:
    storage: 8Gi
  hostPath:
    path: /data
  persistentVolumeReclaimPolicy: Retain
```

install using helm:

```
helm install postgres stable/postgresql
NAME: postgres
LAST DEPLOYED: Wed Dec 11 10:52:18 2019
NAMESPACE: default
STATUS: deployed
REVISION: 1
TEST SUITE: None
NOTES:
** Please be patient while the chart is being deployed **

PostgreSQL can be accessed via port 5432 on the following DNS name from within your cluster:

    postgres-postgresql.default.svc.cluster.local - Read/Write connection

To get the password for "postgres" run:

    export POSTGRES_PASSWORD=$(kubectl get secret --namespace default postgres-postgresql -o jsonpath="{.data.postgresql-password}" | base64 --decode)

To connect to your database run the following command:

    kubectl run postgres-postgresql-client --rm --tty -i --restart='Never' --namespace default --image docker.io/bitnami/postgresql:11.6.0-debian-9-r0 --env="PGPASSWORD=$POSTGRES_PASSWORD" --command -- psql --host postgres-postgresql -U postgres -d postgres -p 5432



To connect to your database from outside the cluster execute the following commands:

    kubectl port-forward --namespace default svc/postgres-postgresql 5432:5432 &
    PGPASSWORD="$POSTGRES_PASSWORD" psql --host 127.0.0.1 -U postgres -d postgres -p 5432
```

log into container with bash shell:

```
kubectl exec -it postgres-deployment-6cc589b57-jddwh -- bin/bash
```

log into psql using the following:

```
root@postgres-deployment-6cc589b57-jddwh:/# psql postgres postgres
psql (12.1 (Debian 12.1-1.pgdg100+1))
Type "help" for help.

postgres=# \l
                                 List of databases
   Name    |  Owner   | Encoding |  Collate   |   Ctype    |   Access privileges
-----------+----------+----------+------------+------------+-----------------------
 postgres  | postgres | UTF8     | en_US.utf8 | en_US.utf8 |
 template0 | postgres | UTF8     | en_US.utf8 | en_US.utf8 | =c/postgres          +
           |          |          |            |            | postgres=CTc/postgres
 template1 | postgres | UTF8     | en_US.utf8 | en_US.utf8 | =c/postgres          +
           |          |          |            |            | postgres=CTc/postgres
(3 rows)

postgres=#
```

## Begin

begin:

```
curl -d '{"stateList":[[[" "," "," "," "," "," "," "," "],[" "," "," "," "," "," "," "," "],[" "," "," "," "," "," "," "," "],[" "," "," ","O","X"," "," "," "],[" "," "," ","X","O"," "," "," "],[" "," "," "," "," "," "," "," "],[" "," "," "," "," "," "," "," "],[" "," "," "," "," "," "," "," "]]],"color":"X","ip":"10.42.0.1"}' -H "Content-Type: application/json" -X POST http://10.42.0.1:8080/api/v1/solution
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
