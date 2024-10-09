#!/bin/bash

test "$GITLAB_USERNAME" &&
test "$GITLAB_PAT" &&
test "$1" &&
test "$1" == "get" &&
GITLAB_TOKEN=`printf "$GITLAB_USERNAME:$GITLAB_PAT" |  base64 -w 0` &&
echo "capability[]=authtype" &&
echo "authtype=Basic" &&
echo "credential=$GITLAB_TOKEN"
