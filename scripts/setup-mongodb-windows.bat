@echo off
:: ============================================================
::  MongoDB Auto-Start + Memory Cap Setup — Windows
::  RIGHT-CLICK this file → "Run as administrator"
:: ============================================================

:: Check admin rights
net session >nul 2>&1
if %errorLevel% NEQ 0 (
    echo.
    echo  ERROR: Please RIGHT-CLICK this file and choose "Run as administrator"
    echo.
    pause
    exit /b 1
)

echo.
echo  ========================================
echo    MongoDB Setup Script - Windows
echo  ========================================
echo.

:: Find MongoDB version folder
set "MONGO_BASE=C:\Program Files\MongoDB\Server"
set "MONGO_VER="
for /d %%i in ("%MONGO_BASE%\*") do set "MONGO_VER=%%i"

if "%MONGO_VER%"=="" (
    echo  ERROR: MongoDB not found in %MONGO_BASE%
    echo  Please install MongoDB first.
    pause
    exit /b 1
)

echo  Found MongoDB at: %MONGO_VER%
echo.

set "CFG_PATH=%MONGO_VER%\bin\mongod.cfg"
set "DATA_PATH=%MONGO_VER%\data"
set "LOG_PATH=%MONGO_VER%\log\mongod.log"

:: Write config with 0.5 GB memory cap
echo  Applying 0.5 GB memory cap...

(
echo storage:
echo   dbPath: %DATA_PATH%
echo   wiredTiger:
echo     engineConfig:
echo       cacheSizeGB: 0.5
echo.
echo systemLog:
echo   destination: file
echo   logAppend: true
echo   path: %LOG_PATH%
echo.
echo net:
echo   port: 27017
echo   bindIp: 127.0.0.1
) > "%CFG_PATH%"

echo  Config updated: %CFG_PATH%
echo.

:: Stop service first (in case running with old config)
echo  Stopping MongoDB service...
net stop MongoDB >nul 2>&1

:: Set to Automatic startup
echo  Setting MongoDB to start automatically on boot...
sc config MongoDB start= auto

:: Start MongoDB
echo  Starting MongoDB...
net start MongoDB

if %errorLevel% EQU 0 (
    echo.
    echo  ========================================
    echo    MongoDB is RUNNING
    echo    - Starts automatically on every boot
    echo    - Memory capped at 0.5 GB
    echo  ========================================
) else (
    echo.
    echo  ERROR: MongoDB failed to start.
    echo  Check Windows Event Viewer for details.
)

echo.
pause
