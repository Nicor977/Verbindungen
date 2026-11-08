@echo off
rem Startet die Verbindungen-App lokal unter http://localhost:8765
rem Diese Datei in den Ordner legen, in dem Verbindungen.zip bzw. die App liegt
rem (z. B. G:\2delete\Verbindungen\v1\) und per Doppelklick starten.
setlocal
set "DIR=%~dp0"
if "%DIR:~-1%"=="\" set "DIR=%DIR:~0,-1%"
cd /d "%DIR%"

rem 1) Zip nur entpacken, wenn die App noch nicht entpackt ist
if not exist "%DIR%\index.html" if not exist "%DIR%\verbindungen\index.html" (
  if exist "%DIR%\Verbindungen.zip" (
    echo Entpacke Verbindungen.zip ...
    powershell -NoProfile -ExecutionPolicy Bypass -Command "Expand-Archive -LiteralPath '%DIR%\Verbindungen.zip' -DestinationPath '%DIR%' -Force"
  ) else (
    echo Weder index.html noch Verbindungen.zip in %DIR% gefunden.
    pause
    exit /b 1
  )
)

rem 2) In den Ordner mit index.html wechseln
if not exist "%DIR%\index.html" cd /d "%DIR%\verbindungen"

rem 3) Python suchen
set "PY="
python --version >nul 2>&1 && set "PY=python"
if not defined PY py --version >nul 2>&1 && set "PY=py"
if not defined PY (
  echo Python wurde nicht gefunden. Bitte von https://www.python.org installieren.
  pause
  exit /b 1
)

rem 4) Browser oeffnen und Server starten (Fenster schliessen oder Strg+C beendet ihn)
echo App laeuft unter http://localhost:8765  -  Beenden mit Strg+C
start "" "http://localhost:8765"
%PY% -m http.server 8765
pause
