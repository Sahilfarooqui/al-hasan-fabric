setlocal
echo Al Hasan Fabric - Windows setup
echo Requires Node.js 20+ from https://nodejs.org/
cd /d "%~dp0"
copy .env.example .env
call npm install
call npm run setup
echo.
echo Done. Start with: npm run dev
echo Admin path /admin - see .env.example
pause
