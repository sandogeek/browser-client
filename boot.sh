#!/bin/bash
# TODO 自动git pull \assets\proto文件夹和\src\app\shared\model\packet\PacketId.ts文件
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
cd ..
cd ..
cd ..
cd ..
cd ..
./node_modules/protobufjs/bin/pbjs -t static-module -w commonjs -o ./src/app/shared/model/proto/bundle.js ./src/assets/proto/*.proto
./node_modules/protobufjs/bin/pbts -o ./src/app/shared/model/proto/bundle.d.ts ./src/app/shared/model/proto/bundle.js
echo 已在目录$(dirname $(readlink -f "$0"))下生成：
ls ./src/app/shared/model/proto/
ng s
cd /C/Users/sando/AppData/Local/Google/Chrome/Application
./chrome http://localhost:4200 --remote-debugging-port=8989