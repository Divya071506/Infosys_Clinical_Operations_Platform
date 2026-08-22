@echo off
title ICOP React Frontend Server
echo ===================================================
echo Starting Infosys Clinical Operations Platform Frontend
echo ===================================================

cd /d "%~dp0frontend"
echo Launching React + Vite on http://localhost:5173 ...
npm run dev
pause
