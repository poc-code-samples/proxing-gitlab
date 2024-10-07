#!/bin/bash

VANILLA_URI="https://gitlab.com/yrfonfria/sample-project.git"
CUSTOM_URI="http://localhost:3000/yrfonfria/sample-project.git"

if [[ "$1" ]] && [[ "$1" == "vanilla" ]]
then
  URL=$VANILLA_URI
else
  URL=$CUSTOM_URI
fi


export GIT_CURL_VERBOSE=1
export GIT_TRACE_REDACT=0


DESTINATION="/tmp/`LC_ALL=C tr -dc A-Za-z0-9 < /dev/urandom | head -c 10`"

echo "Cloning $URL into $DESTINATION"

git clone $URL $DESTINATION

exit 0
