#!/bin/zsh

file="jj_tv_ext_archive.zip"

cd ./dist

if [ -e "$file" ]; then
    rm "$file"
    echo "File $file deleted."
else
    echo "File $file does not exist."
fi

# zip ./dist
zip -r jj_tv_ext_archive.zip overlay.html overlay-config.html mobile.html panel.html config.html assets/
