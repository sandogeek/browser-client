@echo off
REM bat太难用了，不想写了，建议把vscode默认shell 选为git bash 执行boot.sh
REM if exist "src\app\shared\model\proto" (
REM echo "dir existed"
REM REM cd src/app/shared/model/proto
REM ) else (
REM REM md src/app/shared/model/proto
REM )
REM if exist src/app/shared/model/proto echo "src/app/shared/model/proto exist" & cd src/app/shared/model/proto
REM pbjs -t static-module -w commonjs -o bundle.js ../../../../assets/proto/*.proto
REM pbts -o bundle.d.ts bundle.js
REM ng s
set backdir="%1\src\app\shared\model\proto"
echo %backdir%
if (exist %backdir%) (echo "已经存在文件夹") 
REM if (not exist "C:\假桌面天下第一\VirtualGame\browser-client\src\app\shared\model\proto") (echo 文件不存在)