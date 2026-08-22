@echo off
title ICOP Spring Boot Backend Server
echo ===================================================
echo Starting Infosys Clinical Operations Platform Backend
echo ===================================================

if exist "%LOCALAPPDATA%\apache-maven-3.9.9\bin" (
    set "PATH=%LOCALAPPDATA%\apache-maven-3.9.9\bin;%PATH%"
)

cd /d "%~dp0backend"
echo Launching Spring Boot on http://localhost:8080 ...
mvn spring-boot:run
pause
