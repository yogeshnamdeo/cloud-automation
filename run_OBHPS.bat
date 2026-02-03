@echo off
setlocal

title OBHPS JMeter Automation

echo ===============================
echo Running BAT on GitHub Actions
echo Current directory: %CD%
echo ===============================

REM Run PowerShell script from SAME directory as BAT
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0run_all_tests_OBHPS.ps1"

IF %ERRORLEVEL% NEQ 0 (
    echo PowerShell script failed
    exit /b 1
)

echo BAT execution completed successfully
exit /b 0
