@echo off
REM Windows Setup Script for uv Installation
REM This is a batch file alternative to setup-uv.ps1
REM Installs uv, the Python package/project manager, via the official Astral install script

setlocal enabledelayedexpansion

echo.
echo === uv Installation Setup Script ===
echo.

REM Check if uv is already installed
echo Checking if uv is already installed...
where uv >nul 2>&1
if %errorLevel% equ 0 (
    for /f "tokens=*" %%i in ('uv --version') do set UV_VERSION=%%i
    echo [OK] uv is already installed: !UV_VERSION!
    echo.
    set /p REINSTALL="uv is already installed. Do you want to reinstall/update it? (y/n): "
    if /i "!REINSTALL!" neq "y" (
        echo Installation cancelled.
        pause
        exit /b 0
    )
) else (
    echo uv is not installed. Proceeding with installation...
)

echo.

REM Install uv via the official Astral install script
echo Installing uv...
echo Running: powershell -ExecutionPolicy ByPass -c "irm https://astral.sh/uv/install.ps1 ^| iex"
echo.

powershell -ExecutionPolicy ByPass -c "irm https://astral.sh/uv/install.ps1 | iex"

echo.
echo Verifying installation...
where uv >nul 2>&1
if %errorLevel% equ 0 (
    for /f "tokens=*" %%i in ('uv --version') do set UV_VERSION=%%i
    echo [OK] uv installation successful!
    echo     !UV_VERSION!
) else (
    echo [ERROR] uv installation may have failed or uv is not in PATH
    echo Please restart your terminal so the updated PATH takes effect, then run "uv --version" again.
    pause
    exit /b 1
)

echo.
echo === Setup Complete ===
echo You can now use uv from the command line.
echo.
pause
