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

Requirements:
- Node.js >= v20.11
- Have these environment variables in your system.
  - GITLAB_USERNAME: your gitlab user name
  - GITLAB_PAT: your gitlab personal access token

**Note**: This step is very important as both the `demo` script and the `application` uses them.

Consequences of not setting up the environment variables properly:
- For the node app: the server will not be able to create the authentication header properly possibly causing an authentication failure in gitlab.
- For the `demo` script: If used with  `vanilla` argument. It will prompt you for username/password to authenticate against gitlab.


#### Building the service.

Clone this repository

```sh
git clone https://github.com/poc-code-samples/proxing-gitlab.git

```
Build the proxy server

```sh
cd proxing-gitlab
git checkout alternative-http-proxy
npm i && npm run build
npm run start
```

The web server will start listening on port 3000.

#### Cloning the sample repository

There is a helper script to clone the sample repository and it operates in 2 ways.

1. Cloning the sample repository without using the proxy service.
  ```sh
  ./scripts/demo.sh vanilla
  ```
2. Cloning the sample repository using the proxy service.
  ```sh
  ./scripts/demo.sh
  ```
Also if you do not want to be asked for credentials when using the demo script with `vanilla` option. Then you must tweak the global `.gitconfig` file by adding these lines.

```text
[credential "https://gitlab.com/yrfonfria/sample-project.git"]
	helper=/home/yrfonfria/Projects/01.Learning/POCs/http-proxy/scripts/credentials.sh
```
Here is why `GITLAB_USERNAME` and `GITLAB_PAT` environment variables needs to be exported in the terminal where  . If you fail git will ask you for your username/password.

Default sample repository is located at `yrfonfria/sample-project.git`. I am using the free gitlab subscription and internal scope is not available. This means, if someone else but me, I mean YOU are willing to run this example. Then you need to create your own private repository and replace it in the [demo](./scripts/demo.sh) script and the `.gitconfig` file.



## Results.




