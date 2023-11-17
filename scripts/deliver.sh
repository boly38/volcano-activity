#!/bin/bash
set -e
# Any subsequent(*) commands which fail will cause the shell script to exit immediately
DELIVER_DIRECTORY=./dist

if [ "${GITHUB_REF_NAME}" != "prod" ]; then
  # npm run rebuild-ui-dev
  npm run rebuild-ui
else
  npm run rebuild-ui
fi
echo deliver
rm -rf ${DELIVER_DIRECTORY}
mkdir -p ${DELIVER_DIRECTORY}/ui ${DELIVER_DIRECTORY}/front-end/
mv front-end/build/* ${DELIVER_DIRECTORY}/ui/
cp -R src/ package* ${DELIVER_DIRECTORY}
cp -R front-end/package* ${DELIVER_DIRECTORY}/front-end/
echo "${DELIVER_DIRECTORY} - branch ${GITHUB_REF_NAME} - DONE"