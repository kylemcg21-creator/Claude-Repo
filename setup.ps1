# Windows Setup Script for Git Installation via Winget
# This script automates the installation of Git using Windows Package Manager (winget)

# Requires Windows 10/11 with winget installed
# Run as Administrator for best results

Write-Host "=== Git Installation Setup Script ===" -ForegroundColor Cyan
Write-Host ""

# Check if running as Administrator
$isAdmin = ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole] "Administrator")

if (-not $isAdmin) {
    Write-Host "WARNING: This script should ideally be run as Administrator" -ForegroundColor Yellow
    Write-Host "Some operations may fail without elevated privileges." -ForegroundColor Yellow
    Write-Host ""
}

# Check if winget is installed
Write-Host "Checking for winget..."
try {
    $wingetVersion = winget --version
    Write-Host "✓ winget is installed: $wingetVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ winget is not installed or not in PATH" -ForegroundColor Red
    Write-Host "Please install Windows Package Manager from Microsoft Store or:" -ForegroundColor Yellow
    Write-Host "  https://github.com/microsoft/winget-cli/releases" -ForegroundColor Yellow
    exit 1
}

Write-Host ""

# Check if Git is already installed
Write-Host "Checking if Git is already installed..."
try {
    $gitVersion = git --version
    Write-Host "✓ Git is already installed: $gitVersion" -ForegroundColor Green
    Write-Host ""
    $response = Read-Host "Git is already installed. Do you want to reinstall it? (y/n)"
    if ($response -ne "y" -and $response -ne "Y") {
        Write-Host "Installation cancelled." -ForegroundColor Cyan
        exit 0
    }
} catch {
    Write-Host "Git is not installed. Proceeding with installation..." -ForegroundColor Cyan
}

Write-Host ""

# Install Git via winget
Write-Host "Installing Git via winget..." -ForegroundColor Cyan
Write-Host "Running: winget install --id Git.Git -e --source winget" -ForegroundColor Gray
Write-Host ""

winget install --id Git.Git -e --source winget

# Check if installation was successful
Write-Host ""
Write-Host "Verifying installation..."
try {
    $gitVersion = git --version
    Write-Host "✓ Git installation successful!" -ForegroundColor Green
    Write-Host "  $gitVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ Git installation may have failed or Git is not in PATH" -ForegroundColor Red
    Write-Host "Please try restarting your terminal or computer." -ForegroundColor Yellow
    exit 1
}

Write-Host ""
Write-Host "=== Setup Complete ===" -ForegroundColor Cyan
Write-Host "You can now use Git from the command line." -ForegroundColor Green
