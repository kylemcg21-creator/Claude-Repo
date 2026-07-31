# Windows Setup Script for uv Installation
# This script automates the installation of uv, the Python package/project manager,
# using the official Astral install script.

# Run as Administrator for best results (not strictly required for a per-user install)

Write-Host "=== uv Installation Setup Script ===" -ForegroundColor Cyan
Write-Host ""

# Check if uv is already installed
Write-Host "Checking if uv is already installed..."
try {
    $uvVersion = uv --version
    Write-Host "✓ uv is already installed: $uvVersion" -ForegroundColor Green
    Write-Host ""
    $response = Read-Host "uv is already installed. Do you want to reinstall/update it? (y/n)"
    if ($response -ne "y" -and $response -ne "Y") {
        Write-Host "Installation cancelled." -ForegroundColor Cyan
        exit 0
    }
} catch {
    Write-Host "uv is not installed. Proceeding with installation..." -ForegroundColor Cyan
}

Write-Host ""

# Install uv via the official Astral install script
Write-Host "Installing uv..." -ForegroundColor Cyan
Write-Host 'Running: powershell -ExecutionPolicy ByPass -c "irm https://astral.sh/uv/install.ps1 | iex"' -ForegroundColor Gray
Write-Host ""

powershell -ExecutionPolicy ByPass -c "irm https://astral.sh/uv/install.ps1 | iex"

# Check if installation was successful
Write-Host ""
Write-Host "Verifying installation..."
try {
    $uvVersion = uv --version
    Write-Host "✓ uv installation successful!" -ForegroundColor Green
    Write-Host "  $uvVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ uv installation may have failed or uv is not in PATH" -ForegroundColor Red
    Write-Host "Please restart your terminal so the updated PATH takes effect, then run 'uv --version' again." -ForegroundColor Yellow
    exit 1
}

Write-Host ""
Write-Host "=== Setup Complete ===" -ForegroundColor Cyan
Write-Host "You can now use uv from the command line." -ForegroundColor Green
