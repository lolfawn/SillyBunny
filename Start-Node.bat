@echo off
REM Force SillyBunny to use Node.js instead of Bun.
REM Use this if Bun causes high CPU usage on your platform.
setlocal enabledelayedexpansion
pushd %~dp0

where node > nul 2>&1
if %errorlevel% neq 0 (
    echo Node.js was not found in PATH.
    echo Install Node.js from https://nodejs.org/ or use Start.bat for Bun.
    goto end
)

set NODE_ENV=production
set "_dependency_profile=node-production"
if exist node_modules\eslint\package.json set "_dependency_profile=node-development"
node scripts\dependency-state.js check !_dependency_profile! > nul 2>&1
if !errorlevel! neq 0 (
    if "!_dependency_profile!"=="node-development" (
        echo Installing packages via npm including development tooling (Node.js mode)...
    ) else (
        echo Installing packages via npm (Node.js mode)...
    )
    if exist package-lock.json (
        if "!_dependency_profile!"=="node-development" (
            call npm ci --no-audit --no-fund --loglevel=error
        ) else (
            call npm ci --no-audit --no-fund --omit=dev --loglevel=error
        )
    ) else (
        if "!_dependency_profile!"=="node-development" (
            call npm install --no-audit --no-fund --loglevel=error
        ) else (
            call npm install --no-audit --no-fund --omit=dev --loglevel=error
        )
    )
    if !errorlevel! neq 0 goto end
    node scripts\dependency-state.js mark !_dependency_profile!
    if !errorlevel! neq 0 goto end
) else (
    echo Dependencies are up to date.
)

echo Entering SillyBunny (Node.js mode)...
set NODE_NO_WARNINGS=1
node --no-warnings server.js %*

:end
pause
popd
endlocal
