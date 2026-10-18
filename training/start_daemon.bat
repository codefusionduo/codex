@echo off
title CodeCraft AI - 10,000 Lakh Lines Continuous Trainer
cd /d "%~dp0\.."
echo ======================================================================
echo    CODECRAFT AI - 10,000 LAKH (1 BILLION) LINES CONTINUOUS TRAINER
echo    A Suku Company Product - 24/7 Telegram Sync Active
echo ======================================================================
echo.
python training\continuous_trainer.py --batch-lines 1000000 --delay 60
pause
