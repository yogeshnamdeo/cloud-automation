@echo off
setlocal

title OBHPS JMeter Automation

echo ===============================
echo Running BAT on GitHub Actions
echo Current directory: %CD%
echo ===============================

REM Call PowerShell script RELATIVE to repo
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0run_all_tests_OBHPS.ps1"

REM Optional wait
timeout /t 5 /nobreak >nul

echo BAT execution completed
exit /b 0
