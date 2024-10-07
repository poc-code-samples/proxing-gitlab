#!/bin/bash

test "$1" &&
test "$1" == "get" &&
echo "capability[]=authtype" &&
echo "authtype=Basic" &&
echo "credential=$GITLAB_TOKEN"
