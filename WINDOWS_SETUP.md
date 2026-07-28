# Windows Setup Guide

This guide provides instructions for setting up this repository on Windows, including automated Git installation via Windows Package Manager (winget).

## Prerequisites

- Windows 10 or Windows 11
- Windows Package Manager (winget) installed
- Administrator privileges (recommended)

## Installing winget

If you don't already have winget installed, you can get it from:

1. **Microsoft Store** (Recommended):
   - Open the Microsoft Store app
   - Search for "Windows Package Manager Client"
   - Click "Install"

2. **GitHub Releases**:
   - Visit: https://github.com/microsoft/winget-cli/releases
   - Download the latest `.msixbundle` file
   - Double-click to install

## Quick Start

### Option 1: PowerShell Script (Recommended)

1. Open **PowerShell as Administrator**
2. Navigate to this repository directory:
   ```powershell
   cd "path\to\repository"
   ```
3. Run the setup script:
   ```powershell
   .\setup.ps1
   ```

The script will:
- Check if winget is installed
- Check if Git is already installed
- Install Git using `winget install --id Git.Git -e --source winget`
- Verify the installation

### Option 2: Batch Script

1. Open **Command Prompt as Administrator**
2. Navigate to this repository directory:
   ```cmd
   cd "path\to\repository"
   ```
3. Run the setup script:
   ```cmd
   setup.bat
   ```

The script will perform the same steps as the PowerShell version.

### Option 3: Manual Installation

Run the following command in PowerShell or Command Prompt (as Administrator):

```powershell
winget install --id Git.Git -e --source winget
```

## Verification

After installation, verify Git is working by opening a new terminal and running:

```bash
git --version
```

You should see output like:
```
git version 2.x.x.windows.x
```

## Troubleshooting

### winget not found
- Make sure winget is installed (see "Installing winget" above)
- Restart your terminal if you just installed it
- Ensure you're using Windows 10 (build 19041+) or Windows 11

### Git installation fails
- Make sure you're running as Administrator
- Check your internet connection
- Try running the command manually:
  ```
  winget install --id Git.Git -e --source winget
  ```

### Git not found after installation
- Restart your terminal or computer
- Verify Git was installed to your PATH:
  ```
  where git
  ```

## Next Steps

Once Git is installed, you can:

1. **Configure Git**:
   ```bash
   git config --global user.name "Your Name"
   git config --global user.email "your.email@example.com"
   ```

2. **Clone repositories**:
   ```bash
   git clone <repository-url>
   ```

3. **Use Claude Code** with this repository on claude.ai/code

## Additional Resources

- [Git Documentation](https://git-scm.com/doc)
- [Windows Package Manager Documentation](https://learn.microsoft.com/en-us/windows/package-manager/winget/)
- [GitHub's Git Setup Guide](https://github.com/git-tips/tips)
