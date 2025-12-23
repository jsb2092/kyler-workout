# Kyler Workout

A personalized weekly workout planner built with React, featuring voice assistant, timers, streak tracking, and iOS support via Capacitor.

## Features

- **Weekly Workout Schedule** - Structured workouts for each day (Upper Body Push, Lower Body, Pull + Core, Cardio, Rest Days)
- **Exercise Timers** - Built-in timers for warm-ups, cool-downs, and timed exercises
- **Stopwatch** - Dedicated stopwatch for tracking exercise duration
- **Voice Assistant** - Hands-free control with voice commands (start warmup, pause timer, complete workout, etc.)
- **Streak Tracking** - Track workout consistency with daily streaks
- **Difficulty Settings** - Adjust exercise difficulty (easier/normal/harder versions)
- **Custom Workouts** - Edit exercises, goals, and workout routines
- **Dark/Light Themes** - Multiple theme options with customizable accent colors
- **PWA Support** - Install as a progressive web app for offline use
- **iOS App** - Native iOS support via Capacitor
- **Data Persistence** - Workout history and settings stored in IndexedDB
- **Wake Lock** - Keeps screen on during workouts

## Tech Stack

- React 18
- TypeScript
- Vite
- TailwindCSS
- IndexedDB (via idb)
- Capacitor (iOS)
- Lucide React (icons)
- vite-plugin-pwa

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

### Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## iOS Development

This project uses Capacitor for iOS support.

```bash
# Sync web assets to iOS
npx cap sync ios

# Open in Xcode
npx cap open ios
```

## Voice Commands

When voice assistant is enabled, you can use commands like:
- "Start warmup" / "Start cooldown"
- "Pause" / "Resume"
- "Start stopwatch" / "Stop stopwatch"
- "Complete workout"
- "Go to Monday" / "Go to Tuesday" (etc.)
- "Go back"

## License

Private - All rights reserved
