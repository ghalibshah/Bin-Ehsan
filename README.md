# Bin Ehsan Building - Expense Management System

A modern, clean, and professional residential building expense management web application built with Next.js 14, TypeScript, and Tailwind CSS.

## Features

- **Dashboard Overview**: Summary cards showing total expenses, transactions, highest category, and monthly averages
- **Expense Visualization**: Interactive charts showing expense trends and category breakdowns
- **Expense Management**: Add and track building expenses with categories like electricity, water, gas, maintenance, etc.
- **Responsive Design**: Desktop-first design with full mobile support
- **Modern UI**: Professional, trustworthy look using shadcn/ui components

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **UI Components**: shadcn/ui + Radix UI primitives
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Dashboard page
│   └── globals.css        # Global styles
├── components/
│   ├── ui/                # Reusable UI components
│   ├── layout/            # Layout components (Header)
│   ├── dashboard/         # Dashboard-specific components
│   └── expenses/          # Expense-related components
├── data/
│   └── mockData.ts        # Mock data and utility functions
├── lib/
│   ├── utils.ts           # Utility functions
│   └── api.ts             # API placeholder functions
└── types/
    └── expense.ts         # TypeScript types and constants
```

## Expense Categories

- ⚡ Electricity
- 💧 Water
- 🔥 Gas
- 🔧 Maintenance
- 🧹 Cleaning
- 🛡️ Security
- 🛠️ Repairs
- 🛗 Lift/Elevator
- 📦 Other

## Future Improvements

- [ ] Supabase integration for persistent data storage
- [ ] User authentication
- [ ] Expense editing and deletion
- [ ] Export to PDF/Excel
- [ ] Multi-language support (Urdu/English)
- [ ] Monthly reports and analytics
- [ ] Budget tracking and alerts

## License

Private - All rights reserved.

