# Changelog

All notable changes to OC Dashporter are documented here.

## [1.0.2] - 2026-03-26

### Added
- Auto-updater via `electron-updater` — app checks for new versions on launch, downloads silently in the background, and prompts to restart when ready
- Update also installable manually at any time via `wget` + `dpkg -i` — both methods work independently

## [1.0.1] - 2026-03-26

### Security
- Enabled `sandbox: true` to isolate the renderer process at the OS level
- Locked `will-navigate` to local gateway origin — external URLs open in system browser
- Denied all new-window creation from inside the Control UI via `setWindowOpenHandler`
- Explicitly set `webSecurity: true`, `allowRunningInsecureContent: false`, `experimentalFeatures: false`
- Removed dead macOS `activate` handler (app is Linux-only)

### Compatibility
- Verified against OpenClaw v2026.3.24 — no client changes required

## [1.0.0] - 2026-03-01

### Added
- Initial release
- Electron shell wrapping the OpenClaw Control UI
- Tailscale-based remote gateway connectivity
- Persistent token authentication via Electron session
- One-time device pairing flow
- `.deb` package targeting Debian-based Linux
- GitHub Actions CI/CD pipeline publishing to GitHub Releases
