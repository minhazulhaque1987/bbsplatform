@echo off
chcp 65001 >nul

set "ROOT=%~dp0"
set "ROOT=%ROOT:~0,-1%"

echo Building from: %ROOT%

set "JAVA_HOME=C:\Program Files\Eclipse Adoptium\jdk-21.0.11.10-hotspot"
set "PATH=%JAVA_HOME%\bin;%PATH%"

cd /d "%ROOT%"

call gradlew.bat assembleDebug

echo.
echo ✅ Build complete!
echo APK: %ROOT%\app\build\outputs\apk\debug\app-debug.apk
pause