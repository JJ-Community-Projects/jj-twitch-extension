#!/bin/zsh

# delete ./dist folder
if [ -e "./dist" ]; then
  rm -r ./dist
else
    echo "Folder ./dist does not exist."
fi
