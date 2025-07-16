# Tap Tracker - A Modern Tap Counter App

A beautiful and functional tap counter web application built with Next.js, TypeScript, and Tailwind CSS.

## Features

- **Real-time Tap Counting**: Click the tap button to increment your tap count
- **Target Setting**: Set a custom target number of taps to reach
- **Live Timer**: See how long you've been tapping in real-time
- **Average Calculation**: Track your taps per minute automatically
- **Reset Functionality**: Reset all counters to start over
- **Responsive Design**: Works great on desktop and mobile devices
- **Modern UI**: Clean, card-based design with smooth animations

## Getting Started

### Prerequisites

- Node.js 18+ installed on your machine
- npm or yarn package manager

### Installation

1. Navigate to the project directory:
   ```bash
   cd tap-counter-app
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Building for Production

To create a production build:

```bash
npm run build
```

To start the production server:

```bash
npm start
```

## How to Use

1. **Set Your Target**: Use the number input to set how many taps you want to reach
2. **Start Tapping**: Click the large blue "Tap Me!" button to start counting
3. **Monitor Progress**: Watch your tap count, elapsed time, and average taps per minute update in real-time
4. **Reset**: Click the "Reset" button to start over with a fresh count

## Technologies Used

- **Next.js 15**: React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first CSS framework
- **Custom UI Components**: Card, Button, and Input components
- **React Hooks**: useState and useEffect for state management

## Project Structure

```
tap-counter-app/
├── src/
│   ├── app/                 # Next.js App Router
│   │   ├── globals.css      # Global styles and theme
│   │   ├── layout.tsx       # Root layout
│   │   └── page.tsx         # Home page
│   ├── components/          # React components
│   │   ├── ui/              # Reusable UI components
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   └── input.tsx
│   │   └── TapCounterApp.tsx # Main app component
│   └── lib/
│       └── utils.ts         # Utility functions
├── public/                  # Static assets
└── package.json            # Dependencies and scripts
```

## License

This project is open source and available under the MIT License.