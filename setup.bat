@echo off
REM Windows Setup Script for Git Installation via Winget
REM This is a batch file alternative to setup.ps1
REM Run as Administrator for best results

setlocal enabledelayedexpansion

echo.
echo === Git Installation Setup Script ===
echo.

REM Check if running as Administrator
net session >nul 2>&1
if %errorLevel% neq 0 (
    echo WARNING: This script should ideally be run as Administrator
    echo Some operations may fail without elevated privileges.
    echo.
)

REM Check if winget is installed
echo Checking for winget...
where winget >nul 2>&1
if %errorLevel% equ 0 (
    for /f "tokens=*" %%i in ('winget --version') do set WINGET_VERSION=%%i
    echo [OK] winget is installed: !WINGET_VERSION!
) else (
    echo [ERROR] winget is not installed or not in PATH
    echo Please install Windows Package Manager from Microsoft Store or:
    echo   https://github.com/microsoft/winget-cli/releases
    pause
    exit /b 1
)

echo.

REM Check if Git is already installed
echo Checking if Git is already installed...
where git >nul 2>&1
if %errorLevel% equ 0 (
    for /f "tokens=*" %%i in ('git --version') do set GIT_VERSION=%%i
    echo [OK] Git is already installed: !GIT_VERSION!
    echo.
    set /p REINSTALL="Git is already installed. Do you want to reinstall it? (y/n): "
    if /i "!REINSTALL!" neq "y" (
        echo Installation cancelled.
        pause
        exit /b 0
    )
) else (
    echo Git is not installed. Proceeding with installation...
)

echo.

REM Install Git via winget
echo Installing Git via winget...
echo Running: winget install --id Git.Git -e --source winget
echo.

winget install --id Git.Git -e --source winget

echo.
echo Verifying installation...
git --version >nul 2>&1
if %errorLevel% equ 0 (
    for /f "tokens=*" %%i in ('git --version') do set GIT_VERSION=%%i
    echo [OK] Git installation successful!
    echo     !GIT_VERSION!
) else (
    echo [ERROR] Git installation may have failed or Git is not in PATH
    echo Please try restarting your terminal or computer.
    pause
    exit /b 1
)

echo.
echo === Setup Complete ===
echo You can now use Git from the command line.
echo.
pause
