# FTC BasicPoly - From Triangle to Chair

An interactive museum exhibit for the Jerusalem Science Museum. Visitors explore how 3D models are built from polygons by switching between different objects and adjusting polygon resolution using physical buttons and a rotary encoder.

Built with Three.js, the app loads STL models at varying levels of detail (low to high poly) and renders them with flat-shaded normal materials. An Arduino-based keyboard emulator translates physical button presses into keyboard events that the web app listens for.

## System Setup

This exhibit runs on Linux Mint in Chromium kiosk mode. Before setting up this project, follow the museum's system setup guide:

**https://github.com/jerusalem-science-museum/.github/wiki**

The wiki walks you through the base Linux Mint configuration (including Chromium). Once that's done, come back here to set up this project.

## Project Setup

Run the setup script to install Node.js (via nvm), pm2, project dependencies, and configure autostart:

```bash
chmod +x setup.sh
./setup.sh
```

This will:
- Install nvm and Node.js LTS
- Install pm2 globally
- Run `npm install` for project dependencies
- Configure pm2 to survive reboots
- Create an autostart entry so the exhibit launches on login

## Running

The exhibit starts automatically on login via `run.sh`. To run manually:

```bash
./run.sh
```

This builds the project (if needed), starts a production server on port 8080 via pm2, and opens Chromium in kiosk mode.

To monitor logs:

```bash
pm2 logs ftc-app
```

## Development

For local development with hot reload:

```bash
npm run dev
```

This starts a webpack dev server (default port 8080).

## Controls

### User controls (via Arduino keyboard emulator)

The physical interface has a button and a rotary encoder, handled by an Arduino running `keyboardEmulator/keyboardEmulator.ino`:

- **A** (button) - cycle to the next 3D model
- **1 / 2** (rotary encoder) - decrease / increase polygon resolution

### Developer controls (DEBUG mode)

These only work when `DEBUG` is set to `true` in `src/script.js`:

- **B / C / D / E** keys - jump to a specific model directly
- **Arrow keys** - rotate the model
- **Double-click** - toggle fullscreen
