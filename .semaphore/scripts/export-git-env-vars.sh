export GIT_COMMIT_SHA=$(git rev-parse --short HEAD)
export GIT_COMMIT_SHA_LONG=$(git rev-parse HEAD)
export GIT_COMMIT_MSG=$(git show -s --format=%B ${GIT_COMMIT_SHA})
export GIT_BRANCH=$(git rev-parse --abbrev-ref HEAD)