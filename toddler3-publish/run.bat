@echo off
setlocal
cd /d "%~dp0"
set PORT=8010
start "" cmd /c "ping 127.0.0.1 -n 2 >nul & start http://localhost:%PORT%"
echo Starting Arabic Learning Game on http://localhost:%PORT%
echo Keep this window open while playing. Press Ctrl+C to stop the server.
python -m http.server %PORT%
if errorlevel 1 (
  echo.
  echo Could not start the server. Check that Python is installed and port %PORT% is free.
  pause
)
