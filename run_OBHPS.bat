@echo off
title OBHPS JMeter Automation

set PS=C:\Windows\System32\WindowsPowerShell\v1.0\powershell.exe

"%PS%" -NoProfile -ExecutionPolicy Bypass -File "C:\Users\YogeshNamdeo\Downloads\run_all_tests_OBHPS.ps1"

timeout /t 60 /nobreak >nul
exit