#!/bin/bash

if [[ $1 -eq "" ]]; then
    echo "Please supply a version"
    exit
fi

versiony --version=$1 --to=package.json,bower.json
git commit -am "Publish version $1"
git tag $1
git push
git push --tags
