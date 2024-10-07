# POC use http/s proxy between git and gitlab.com


Problem: We want to use web service that acts as a proxy between git on the user machine and gitlab.com

## Why this ?


Assume a scenario we want to use a JWT to authenticate against gitlab.com from one of our services in a Microservices architecture.
This service runs on a container and it does not have access to a browser at all.

We think we can use a Personal Access Token (PAT) created on the fly on behalf of the user and exchange the PAT for th JWT in at proxy level.
This way the proxy manage PATs on behalf of the user.

## Development.

This simple POC does not exahcnge JWTs it just implement an express application that listen to git requests over HTTP and forward the request over https to gitlab.com
In the process it uses a PAT created on gitlab side. This will be provided via environment variable, also the username.


### How to run

Requirements: Node.js >= v20.11

#### Buinding the service.

Clone this repository

```sh
git clone https://github.com/poc-code-samples/proxing-gitlab.git
```
Build the proxy server

```sh
cd proxing-gitlab npm
npm i && npm run build
npm run start
```

The web server will start listening on port 3000.

#### Cloning the sample repository

Export the following environment variables

- GITLAB_USERNAME: your gitlab user name
- GITLAB_PAT: your gitlab personal access token

There is a helper script to clone the sample repository and it operates in 2 ways.

1. Cloning the sample repository without using the proxy service.
  ```sh
  ./scripts/demo.sh vanilla
  ```
2. Cloning the sample repository using the proxy service.
  ```sh
  ./scripts/demo.sh
  ```

The script uses a base64 encrypted token that should be exported in the GITLAB_TOKEN environment variable. So, make sure it is exported properly in the terminal window the script runs. Assuming you have exported the `GITLAB_USERNAME` and `GITLAB_PAT` this new token can be generated with the following command.

```sh
export GITLAB_TOKEN=`echo "$GITLAB_USERNAME:$GITLAB_PAT" |  base64 -w 0`
```

Also if you do not want to be asked for credentials when using the demo script with `vanilla` option. Then you must tweak the global `.gitconfig` file by adding these lines.

```text
[credential "https://gitlab.com/yrfonfria/sample-project.git"]
	helper=/home/yrfonfria/Projects/01.Learning/POCs/http-proxy/scripts/credentials.sh
```
This is why the `GITLAB_TOKEN` environment variable should be set. If you fail git will ask you for your username/password.

Default sample repository is located at `yrfonfria/sample-project.git`. I am using the free gitlab subscription and internal scope is not available. This means, if someone else but me, I mean YOU are willing to run this example. Then you need to create your own private repository and replace it in the [demo](./scripts/demo.sh) script and the `.gitconfig` file.

## Results.

I have several issues. After trial and error modifying the connection parameters. The proxy disconnects from gitlab and the application halts with this error.

```sh
Error: socket hang up
    at connResetException (node:internal/errors:787:14)
    at TLSSocket.socketOnEnd (node:_http_client:519:23)
    at TLSSocket.emit (node:events:530:35)
    at endReadableNT (node:internal/streams/readable:1696:12)
    at process.processTicksAndRejections (node:internal/process/task_queues:82:21) {
  code: 'ECONNRESET'
}
/home/yrfonfria/Projects/01.Learning/POCs/http-proxy/dist/util/httpClient.js:66
                reject(new Error('upstream server responded with error'));
                       ^

Error: upstream server responded with error
    at ClientRequest.<anonymous> (/home/yrfonfria/Projects/01.Learning/POCs/http-proxy/dist/util/httpClient.js:66:24)
    at ClientRequest.emit (node:events:518:28)
    at TLSSocket.socketOnEnd (node:_http_client:519:9)
    at TLSSocket.emit (node:events:530:35)
    at endReadableNT (node:internal/streams/readable:1696:12)
    at process.processTicksAndRejections (node:internal/process/task_queues:82:21)

```


