#!/bin/bash
cd ./src/app
if [ -d "shared" ]; then
    cd ./shared
else
    echo 创建目录shared
    mkdir shared    
    cd ./shared
fi
if [ -d "model" ]; then
    cd ./model
else
    echo 创建目录model
    mkdir model
    cd ./model
fi
if [ -d "proto" ]; then
    cd ./proto
else
    echo 创建目录proto
    mkdir proto
    cd ./proto
fi
pbjs -t static-module -w commonjs -o bundle.js ../../../../assets/proto/*.proto
pbts -o bundle.d.ts bundle.js
echo 已在目录$(dirname $(readlink -f "$0"))下生成：
ls
ng s
cd /C/Users/sando/AppData/Local/Google/Chrome/Application
./chrome http://localhost:4200 --remote-debugging-port=8989