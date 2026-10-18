@echo off
echo ======================================================================
echo    SETTING UP CODECRAFT CONTINUOUS TRAINER TO AUTO-START ON BOOT
echo ======================================================================
echo.

set "SCRIPT_PATH=%~dp0run_silent_daemon.vbs"
set "TASK_NAME=CodeCraft24x7Trainer"

echo [*] Registering Windows Scheduled Task: %TASK_NAME%...
schtasks /create /tn "%TASK_NAME%" /tr "wscript.exe \"%SCRIPT_PATH%\"" /sc onlogon /f /rl HIGHEST >nul 2>&1

if %errorlevel% equ 0 (
    echo [+] SUCCESS: Task '%TASK_NAME%' registered to run automatically on logon!
) else (
    echo [*] Setting up via Windows Startup folder as fallback...
    set "STARTUP_FOLDER=%APPDATA%\Microsoft\Windows\Start Menu\Programs\Startup"
    copy /y "%SCRIPT_PATH%" "%STARTUP_FOLDER%\CodeCraftTrainer.vbs" >nul
    echo [+] SUCCESS: Added CodeCraftTrainer.vbs to Windows Startup folder!
)

echo.
echo CodeCraft will now automatically start in background whenever Windows turns on.
echo To run it right now in the background, double-click: run_silent_daemon.vbs
echo.
pause
