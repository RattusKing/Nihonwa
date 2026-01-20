# 日本話 Nihonwa - Japanese Learning PWA

A fully immersive Japanese learning experience from N5 to N1.

## Features

- **Learn at Your Pace**: No pressure, no daily reminders
- **Real Content, Game-like**: Immerse yourself in authentic Japanese
- **Works Offline**: Study anywhere, anytime with PWA support
- **JLPT Levels**: Structured learning from N5 (Beginner) to N1 (Native Level)

### Core Features

- **Visual Journey Map**: Track your progress across all JLPT levels with skill trees
- **Context Mining Reader**: Click any word in real content for instant definitions
- **Difficulty Dial**: Adjust hints (furigana, romaji, English) in real-time
- **Content Management System**: Add and manage learning content
- **Offline-First**: Full functionality without internet using IndexedDB

### Color-Coded JLPT Levels

- 🟢 **N5** (Beginner) - Green
- 🔵 **N4** (Elementary) - Blue
- 🟡 **N3** (Intermediate) - Yellow
- 🟠 **N2** (Advanced) - Orange
- 🔴 **N1** (Native-level) - Red

## Tech Stack

- **Frontend**: React + TypeScript + Vite
- **Styling**: TailwindCSS
- **State Management**: Zustand with persistence
- **Database**: IndexedDB (offline-first)
- **PWA**: Vite PWA Plugin with Workbox
- **Routing**: React Router

## Getting Started

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

## Project Structure

```
src/
├── components/        # Reusable components
│   ├── Layout.tsx    # Main app layout with navigation
│   └── LevelSelector.tsx # Initial level selection
├── pages/            # Page components
│   ├── Dashboard.tsx
│   ├── ImmersionZone.tsx
│   ├── ContentReader.tsx
│   ├── ContentManager.tsx
│   ├── Progress.tsx
│   └── Settings.tsx
├── store/            # State management
│   └── useStore.ts
├── types/            # TypeScript interfaces
│   └── index.ts
├── utils/            # Utility functions
│   ├── db.ts        # IndexedDB operations
│   └── jlptHelpers.ts
└── data/            # Sample content
    └── sampleContent.ts
```

## Content Format

### Adding Content via Content Manager

Content can be added through the UI with the following format:

**Vocabulary** (one per line):
```
word|reading|meaning|level|partOfSpeech
例|れい|example|N5|noun
```

**Grammar Points** (one per line):
```
です/ます form
は particle (topic marker)
```

## Roadmap

- [x] Basic app structure with PWA support
- [x] Level selection and progress tracking
- [x] Content management system
- [x] Context Mining Reader with Difficulty Dial
- [x] Sample content for all JLPT levels
- [ ] Vocabulary flashcard system with SRS
- [ ] Kanji learning with stroke order
- [ ] Grammar lessons with exercises
- [ ] Content Analyzer (paste any text for analysis)
- [ ] Audio support and pronunciation
- [ ] User accounts with cloud sync (optional)

## License

MIT License - See LICENSE file for details
