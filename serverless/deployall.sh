#!/bin/bash

# TODO Detect and act on error

for folder in `find -iname package.json | grep -v "node_modules" | sed s/package.json//`;
do
    echo "Processing $folder"
    cd $folder
    npm run deploy
    cd ..
done

echo "Done deploying"