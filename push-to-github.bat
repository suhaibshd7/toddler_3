@echo off
setlocal
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0toddler3-publish-to-github.ps1"
echo.
pause
