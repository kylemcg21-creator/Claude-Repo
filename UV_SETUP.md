# uv Setup Guide (Windows)

This guide covers installing [uv](https://docs.astral.sh/uv/), the fast Python
package and project manager from Astral, on Windows using the scripts in this
repository.

## Prerequisites

- Windows 10 or Windows 11
- PowerShell (included with Windows)

## Quick Start

### Option 1: PowerShell Script (Recommended)

1. Open **PowerShell**
2. Navigate to this repository directory:
   ```powershell
   cd "path\to\repository"
   ```
3. Run the setup script:
   ```powershell
   .\setup-uv.ps1
   ```

The script will:
- Check if uv is already installed
- Install uv using the official Astral install script
- Verify the installation

### Option 2: Batch Script

1. Open **Command Prompt**
2. Navigate to this repository directory:
   ```cmd
   cd "path\to\repository"
   ```
3. Run the setup script:
   ```cmd
   setup-uv.bat
   ```

The script performs the same steps as the PowerShell version.

### Option 3: Manual Installation

Run the following command in PowerShell:

```powershell
powershell -ExecutionPolicy ByPass -c "irm https://astral.sh/uv/install.ps1 | iex"
```

This downloads and runs the official install script from
`https://astral.sh/uv/install.ps1`, which installs `uv` and `uvx` for the
current user and adds them to your `PATH`.

## Verification

After installation, open a **new** terminal window (so the updated `PATH`
takes effect) and run:

```powershell
uv --version
```

You should see output like:
```
uv 0.x.x
```

## Troubleshooting

### `irm` or `iex` fails / execution policy errors
- The `-ExecutionPolicy ByPass` flag scopes the bypass to the single command
  and does not change your system-wide execution policy, so this is safe to
  run as-is.
- If your network blocks outbound HTTPS to `astral.sh`, download the
  installer manually from the [uv releases page](https://github.com/astral-sh/uv/releases)
  instead.

### `uv` not found after installation
- Close and reopen your terminal so the updated `PATH` is picked up.
- Verify the install location was added to `PATH`:
  ```powershell
  where.exe uv
  ```

## Next Steps

Once uv is installed, you can use it in place of `pip`/`venv` for this
repository's Python dependency (see the [Python dependency](README.md#dependencies)
section):

```sh
uv venv
uv pip install -e .
```

Or install standalone CLI tools with `uv tool install`, as used for
[Graphify](GRAPHIFY_INSTALLATION.md):

```sh
uv tool install graphifyy
```

## Additional Resources

- [uv Documentation](https://docs.astral.sh/uv/)
- [uv GitHub Repository](https://github.com/astral-sh/uv)
