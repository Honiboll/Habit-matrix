# Habit Matrix

A modular, minimalist habit tracking dashboard built with **React**, **Vite**, **Tailwind CSS**, and **Lucide Icons**, wrapped in **Electron** for native macOS and Windows desktop execution. Retains the sleek dark aesthetic (`#09090b` background with `#f5d087` gold accents) along with a clean Light mode toggle.

---

## 🖥 Desktop App (macOS & Windows)

### Running as a Desktop App on macOS
You can run Habit Matrix natively on your Mac in development:
```bash
npm run app:dev
```
Or start the Electron wrapper directly:
```bash
npm run electron:start
```

### macOS Native Installers
To build a standalone macOS `.dmg` and `.app`:
```bash
npm run app:dist:mac
```
Output files will be located in the `release/` directory:
- `Habit Matrix-1.0.0-arm64.dmg`
- `release/mac-arm64/Habit Matrix.app`

### 🪟 Windows Build via GitHub Actions
A GitHub Actions CI/CD workflow (`.github/workflows/build.yml`) is included. Whenever changes are pushed or a release is created:
1. GitHub runners build the native Windows installer (`Habit-Matrix-Setup-1.0.0.exe` and portable `.exe`).
2. GitHub runners build the native macOS installer (`.dmg`).
3. Binaries are uploaded to the GitHub Actions artifacts and Release page for direct download.

---

## 🌐 Web Development

Run web server locally:
```bash
npm run dev
```

Build production web assets:
```bash
npm run build
```
