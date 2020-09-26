export GIT_COMMIT_SHA=$(git rev-parse --short HEAD)
export GIT_COMMIT_SHA_LONG=$(git rev-parse HEAD)
export GIT_COMMIT_MSG=$(git show -s --format=%B ${GIT_COMMIT_SHA})
export GIT_BRANCH=$(git rev-parse --abbrev-ref HEAD)
export IMAGE_TAG=`echo "${GIT_COMMIT_MSG}" | sed -e "s/ /-/g" | cut -c1-71 | sed "s/$/-${GIT_COMMIT_SHA}/" | sed "s/$/-${GIT_BRANCH}/" | tr -d "'"`