@echo off
echo ========================================================
echo Updating Assets Inventory Project...
echo ========================================================
"C:\Program Files\Git\cmd\git.exe" pull origin main
echo.
echo Building project...
call node node_modules/next/dist/bin/next build
echo.
echo Restarting PM2 assets-inventory...
call pm2 restart assets-inventory
echo ========================================================
echo Update Complete!
echo ========================================================
