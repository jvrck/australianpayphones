# Australian Payphones

## Repository organisation
The `develop` branch is the main branch of the repository. Feature branches are merged to `develop` via an approved pull request.
Successful builds on `develop` are merged to `master`

## Local Development
Australian Payphones is a node command line interface program distributed as an `npm` package. Node.JS v12 is required.

To test the source locally, you will need to perform the following: 

1. Install dependencies
```shell
npm install
```
2. To execute the cli
```shell 
node .
```

## Docker Images 
There are three docker files that are available for testing purposes.

### Dockerfile
This docker image install dependencies, installs the package locally and executes the package. To build the image:
```shell
docker build .
```

### Dockerfile.NPM
This docker image installs `aus-payphones` from the npm repository using `npm` and runs the cli. To build the image:
```shell
docker build . -f 'Dockerfile.NPM'
```

### Dockerfile.Yarn
This docker image installs `aus-payphones` from the npm repository using `yarn` and runs the cli. To build the image:
```shell
docker build . -f 'Dockerfile.YARN'
```

## CI / CD
There are three workflow files that handle CI/CD

### `feature-branch-workflow.js.yml`
This workflow is run on a feature branch that is not `master` or `develop`. Linting and simple tests are run.

### `develop-branch-workflow.yml`
This workflow is run on the `develop` branch after a feature branch is merged. Linting and simple tests are run and the branch is then merged to `master` on successful completion of build tasks.

### `npm-publish.yml`
This workflow is triggered when a release is created. The workflow performs linting and tests and on successful completion, publishes the package to NPM.


![image info](./images/payphone-map.png)