# Diamonds2 deployer

Listens for webhook notifications from Github and deploy new versions of Diamonds on the current host.

It can be used to auto deploy any branch, you just have to filter for the branches you are interested in when starting the application. This way it can be used on one host to deploy a staging version and another to deploy a production version for example.

## Compatibility

Currently only made to work in EC2 on AWS but can be changed easily to work in any environment. The only thing EC2-specific is how the hostname is handled by the script.

## How to setup

Install dependencies:

```
yarn install
```

Register webhook in Github. Only enable the "Check runs" event. Remember the endpoint path and secret!

Start webhook listener with environment config for endpoint path and secret:

```
PORT=<port> GITHUB_SECRET=<webhook secret> ENDPOINT=<path> DEPLOY_BRANCHES=<branches> yarn start
```

Example:

```
PORT=3000 GITHUB_SECRET=abc ENDPOINT="/webhook" DEPLOY_BRANCHES=master yarn start
```

`DEPLOY_BRANCHES` can be a comma separated list of branches if needed.

The example above will start a minimal webserver that listens on for Github webhook events on `<host>:3000/webhook`.

## How it works

The application listens for incoming webhook events from Github and acts accordingly on them. It is only interested in the status checks for branches. It waits for status checks to complete for the branch being built.

When a successful build is detected it passes on the branch name and git commit sha to a script that performs the actual deployment (`redeploy.sh`).

The deployment script pulls the corresponding docker images for the git commit hash (make sure that your build system pushes images for the branch of interest) and then restarts the services using docker compose.

This application does not handle rolling updates and should only be used as a rudimentary way of automating deployments when a build in Github passes.

The deployment script will also publish a message to Slack if there is an environment variable named `SLACK_URL` available in the environment.

## Security

The application verifies the signature from Github to prevent manual/man-in-the-middle invocations.
