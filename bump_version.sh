#!/bin/bash

if  [ "$1" = "" ] ; then
    echo "Please supply a version"
    exit
fi

versiony --version=$1 --to=Gruntfile.js
git commit -am "Publish version $1"
git tag $1
git push
git push --tags
