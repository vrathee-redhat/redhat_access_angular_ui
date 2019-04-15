#!/bin/bash

if  [ "$1" = "" ] ; then
    echo "Please supply a version"
    exit
fi

versiony --version=$1 --to=package.json,bower.json &&
npm install &&
git commit -am "Publish version $1" &&
git tag $1 &&
git push upstream s2i-ohc &&
git push upstream $1
