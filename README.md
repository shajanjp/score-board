# Score Board 🎯

![Score Board Logo](logo.png =100x100)

**Score. Save. Repeat.**  
*The elegant way to track your game scores — no sign-ups, no servers, just pure scorekeeping.*

[![Status](https://img.shields.io/badge/status-active-brightgreen?style=flat-square)](https://github.com/shajanjp/score-board)
[![Version](https://img.shields.io/badge/version-1.0-8b7765?style=flat-square)](https://github.com/shajanjp/score-board)
[![License](https://img.shields.io/badge/license-MIT-blue?style=flat-square)](https://github.com/shajanjp/score-board)
[![Stack](https://img.shields.io/badge/stack-Vanilla%20JS%20%2B%20Tailwind-f7df1e?style=flat-square)](https://github.com/shajanjp/score-board)

[Features](#-features) · [Demo](#-demo) · [Getting Started](#-getting-started) · [How to Use](#-how-to-use) · [Architecture](#-architecture) · [Shortcuts](#-keyboard-shortcuts)

---

## ✨ Features

| Feature | Description |
|---|---|
| **Minimal UI** | Modern, frosted-glass aesthetic that adapts beautifully to both light and dark modes. |
| **Dark Mode** | Auto-detects system preference and allows manual toggle — persisted across sessions. |
| **Real-time Leaderboard** | Aggregates totals across all games with animated progress bars and winner crowns. |
| **Active Game Tracking** | Livescroll the current game with per-player score updates — add or replace modes. |
| **Game History** | Complete scrollable archive of past games with per-player breakdowns and winner indicators. |
| **Player Management** | Add and remove players from a central roster; players persist across all games. |
| **Local Persistence** | All data stored in `localStorage` — nothing leaves your browser. Close and come back, everything's right where you left it. |
| **Responsive Design** | Fluid layout adapts from phone screens to ultrawide monitors. |
| **Offline-ready** | Zero network dependencies after the initial load. Works fully offline. |
| **Toast Notifications** | Subtle, animated feedback for every action — add player, start game, update score, delete. |

## 🎬 Demo

<https://scoreboard.vibe.com>

> Open the app, add your friends, start a game, and start scoring — all in under 10 seconds.

## 🚀 Getting Started

### Prerequisites

- A modern web browser (Chrome, Firefox, Safari, Edge — any evergreen browser works).

### Installation

```bash
# Clone the repository
git clone https://github.com/shajanjp/score-board.git

# Open directly
cd score-board
open index.html
```

Or serve locally with any static file server:

```bash
# Python 3
python3 -m http.server

# Node.js (if you have npx)
npx serve .
```

Then open `http://localhost:8000` (or whichever port your server provides).

### Deployment

The app is a single-page, static application — deploy anywhere you'd host static files:

- **GitHub Pages** — Push to a `gh-pages` branch.
- **Netlify / Vercel** — Drag-and-drop the folder.
- **Any S3 / CDN** — Upload and serve `index.html` as the entry point.

## 📖 How to Use

### 1. Add Players

Click the **+** (Add Player) button in the header. Type a name and press Enter or click "Add". Your roster is saved automatically.

### 2. Start a Game

Click the **New Game** button. Give it a name (auto-suggested as "Game N"), check the participating players, and hit "Start Game".

### 3. Update Scores

In the **Current Game** section, click **Edit** next to any player's name. Enter a score:

- **+ Add** — Adds the value to the player's existing score (e.g., 10 → +5 → 15).
- **Replace** — Overwrites the player's score with the entered value.

### 4. Browse History

Scroll down to the **History** section to see all completed games. Each card shows:

- Game name and creation date.
- Per-player scores with mini progress bars.
- A trophy icon 🏆 next to the winner.
- Active game indicator for the current session.

### 5. Manage Data

- **Delete a game** — Click the trash icon on any history card.
- **Delete a player** — Open the Add Player modal and hover over a player to reveal the delete button.
- **Clear all games** — Click "Clear All" in the History section header.

## 🏗 Architecture

```
score-board/
├── index.html            # Single-page application shell
├── styles.css            # Custom styles (glassmorphism, animations, scrollbars)
├── app.js                # Application logic (state, rendering, modals, persistence)
├── logo.png              # App logo (used in header & OG)
├── favicon.ico           # Browser tab icon
├── apple-touch-icon.png  # Mobile home-screen icon
├── og-image.jpg          # Social sharing preview image
└── README.md             # This file
```

### Data Flow

```
User Action -> app.js (state mutations)
                   |
            localStorage (persistence)
                   |
            renderAll() (re-render UI)
            ├── renderCurrentGame()
            ├── renderTotalScores()
            └── renderGamesHistory()
```

All application state lives in two arrays — `players` (string[]) and `games` (object[]). Every mutation saves to `localStorage` and triggers a full UI re-render, ensuring the leaderboard, active game, and history stay perfectly in sync.

### Design System

- **Glassmorphism** — Frosted-glass panels with `backdrop-filter: blur(20px)` for depth without clutter.
- **Color Palette** — Warm stone tones (`#8b7765`, `#7a6757`) for a tactile, earthy feel.
- **Animations** — `cubic-bezier(0.16, 1, 0.3, 1)` — the "ease-out-expo" curve for buttery, responsive motion.
- **Dark Mode** — Deep purple-gray backgrounds (`#13111a`) for a cozy nighttime mode.

## ⌨️ Keyboard Shortcuts

| Key | Action |
|---|---|
| `Enter` | Submit score in the score modal |
| `Escape` | Close any open modal |

## 🛠 Built With

| Technology | Purpose |
|---|---|
| **HTML5** | Semantic structure & accessible modals |
| **[Tailwind CSS](https://tailwindcss.com)** (CDN) | Utility-first styling with dark mode |
| **Vanilla JavaScript** | All logic, state management, DOM rendering |
| **localStorage** | Client-side persistence — zero backend |

Zero build tools. Zero frameworks. Zero dependencies (other than the Tailwind CDN for initial styling).

## 🤝 Contributing

Contributions are welcome! Since this is a small, focused app, here are the best ways to help:

1. **Report a bug** — Open an issue with steps to reproduce.
2. **Suggest a feature** — Open a discussion or issue describing the idea.
3. **Submit a PR** — Fork the repo, make your changes, and open a pull request.

### Development Notes

- The app is intentionally dependency-light. Please avoid introducing build steps or heavy libraries.
- All styles are in `styles.css` and the Tailwind config in `index.html`'s `<head>`.
- State management is straightforward — just modify `players`/`games` and call `saveData()` + `renderAll()`.

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

*Built with ❤️ by [Shajan](https://shajanjacob.com)*  
*Between sips of coffee & card shuffles* ☕🃏
