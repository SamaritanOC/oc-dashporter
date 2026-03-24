# OC Dashporter

A native Linux desktop app for remote access to your [OpenClaw](https://openclaw.ai) installation.

OC Dashporter wraps the OpenClaw built-in Control UI in an Electron shell, giving you a proper installable app with persistent authentication — no browser, no token prompts, no storage clearing.

## How it works

OC Dashporter connects directly to your OpenClaw gateway over your Tailscale network. Your gateway runs on your home machine as normal. The app is just a secure native window into it from anywhere.
Road Laptop
└── OC Dashporter
└── Tailscale → Your OpenClaw gateway
└── All agents, models, memory, sessions

## Requirements

- OpenClaw installed and running on a host machine
- Tailscale with the host machine on your tailnet
- The host gateway exposed via Tailscale Serve
- Parrot OS or any Debian-based Linux on the remote machine

## Host configuration

Add this to your openclaw.json gateway block:
```json
"tailscale": { "mode": "serve" },
"auth": { "mode": "token", "allowTailscale": true },
"controlUi": {
  "allowedOrigins": ["https://your-tailscale-hostname"]
}
```

## Installation

Download the latest release:
```bash
wget https://github.com/SamaritanOC/oc-dashporter/releases/latest/download/oc-dashporter-amd64.deb
sudo dpkg -i oc-dashporter-amd64.deb
```

Or build from source:
```bash
git clone https://github.com/SamaritanOC/oc-dashporter.git
cd oc-dashporter
npm install
npm run electron:build
sudo dpkg -i dist-app/oc-dashporter-*-amd64.deb
```

## First launch

1. Open OC Dashporter from your application menu
2. Enter your gateway URL (e.g. https://your-machine.tailnet-name.ts.net)
3. Enter your gateway token (found in ~/.openclaw/openclaw.json under gateway.auth.token)
4. Click Connect
5. On your OpenClaw host, approve the pairing request:
```bash
openclaw devices list
openclaw devices approve <requestId>
```

Pairing is a one-time step per device. After that the app connects automatically on every launch.

## Updates

When OpenClaw updates its built-in Control UI, OC Dashporter picks up the changes automatically. The UI always comes directly from your gateway — nothing to update on the client side.

## License

MIT
