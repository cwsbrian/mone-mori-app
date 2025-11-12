# Shared Account Book App

A React Native mobile application for tracking shared expenses and income with real-time collaboration features.

## Features

### Core Functionality
- **Multi-Space Support**: Create and manage multiple account book spaces (Personal, Couple, Family, etc.)
- **Transaction Management**: Add, view, edit, and delete income/expense transactions
- **Real-Time Sync**: Simulated real-time updates across shared spaces
- **Category System**: 16 default categories with custom category support
- **Visual Analytics**: Charts and statistics for spending analysis
- **Calendar View**: View transactions by date with calendar interface

### Screens
1. **Authentication**
   - Login with demo account (john@example.com / password123)
   - Registration with auto-space creation
   - Onboarding flow for new users

2. **Home Tab**
   - Monthly income/expense summary
   - Recent transactions list
   - Pull-to-refresh support

3. **Calendar Tab**
   - Monthly calendar with transaction markers
   - Daily transaction breakdown
   - Visual spending overview

4. **Add Transaction (Center Button)**
   - Quick transaction entry
   - Income/Expense toggle
   - Category selection with icons
   - Advanced options (payment method, description, photo placeholder)

5. **Stats Tab**
   - Period selection (This Month, Last Month)
   - Category breakdown pie chart
   - Expense analysis by category
   - Income vs Expense summary

6. **More Tab**
   - User profile
   - Space management (placeholder)
   - Category settings (placeholder)
   - Premium subscription (placeholder)
   - App settings (placeholder)
   - Logout

## Tech Stack

- **Framework**: React Native with Expo
- **Navigation**: Expo Router (file-based routing)
- **State Management**: Zustand with AsyncStorage persistence
- **UI Components**: Custom components with Ionicons
- **Charts**: react-native-chart-kit
- **Calendar**: react-native-calendars
- **Data Storage**: Local JSON files with AsyncStorage (simulating backend)

## Project Structure

```
app/
├── (auth)/              # Authentication screens
│   ├── login.tsx
│   ├── register.tsx
│   └── onboarding.tsx
├── (tabs)/              # Main tab screens
│   ├── home.tsx
│   ├── calendar.tsx
│   ├── add.tsx
│   ├── stats.tsx
│   └── more.tsx
├── transaction/         # Transaction detail screen
│   └── [id].tsx
├── components/          # Reusable components
│   ├── common/
│   ├── home/
│   ├── calendar/
│   └── stats/
├── store/              # Zustand stores
│   ├── useAuthStore.ts
│   ├── useSpaceStore.ts
│   └── useDataStore.ts
├── data/               # Mock JSON data
│   ├── mockUsers.json
│   ├── mockSpaces.json
│   ├── mockCategories.json
│   └── mockTransactions.json
├── utils/              # Helper functions
│   ├── dataManager.ts
│   ├── dateHelpers.ts
│   └── currencyHelpers.ts
└── types/              # TypeScript types
    └── index.ts
```

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Expo CLI
- iOS Simulator (Mac) or Android Emulator

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm start
```

3. Run on your device:
- Press `i` for iOS simulator
- Press `a` for Android emulator
- Scan QR code with Expo Go app on your phone

### Demo Account
- Email: `john@example.com`
- Password: `password123`

## Data Management

The app uses a local data management system that simulates a backend:

- **AsyncStorage**: Persists data locally on the device
- **Mock Data**: Pre-populated with sample users, spaces, transactions, and categories
- **CRUD Operations**: Full create, read, update, delete functionality
- **Real-time Simulation**: Uses setTimeout to simulate network delays

## Features Implementation Status

### ✅ Completed
- User authentication (login/register)
- Space management (view/switch spaces)
- Transaction CRUD operations
- Category system with icons
- Home screen with summary
- Calendar view
- Statistics with charts
- Transaction detail view
- Empty states
- Pull-to-refresh

### 🚧 Placeholder (Future Implementation)
- Space creation/editing UI
- Category customization UI
- Premium subscription payment
- App settings screens
- Receipt photo upload (Cloudflare R2)
- Bank linking (Phase 2)
- Google/Apple OAuth
- Backend API integration

## Mock Data

The app comes with pre-populated mock data:

- **2 Users**: john@example.com and jane@example.com
- **3 Spaces**: Personal, Couple, and Family account books
- **16 Categories**: 12 expense + 4 income categories
- **10 Transactions**: Sample transactions across different dates

## Currency Support

Currently supports:
- CAD (Canadian Dollar) - Default
- USD, EUR, GBP, JPY, AUD, CNY, INR, KRW

## Development Notes

### State Management
- `useAuthStore`: User authentication and session
- `useSpaceStore`: Space selection and management
- `useDataStore`: Transactions and categories

### Navigation
- File-based routing with Expo Router
- Conditional routing based on auth state
- Tab navigation for main screens
- Stack navigation for detail screens

### Data Flow
1. User logs in → Auth store updated
2. Spaces loaded for user → Space store updated
3. Current space selected → Data store loads transactions/categories
4. User adds transaction → Data store updated → AsyncStorage persisted

## Future Enhancements

### Phase 1 (Current)
- ✅ Core transaction tracking
- ✅ Multiple spaces
- ✅ Basic analytics
- 🚧 Space/category management UI

### Phase 2 (Planned)
- Backend API (Nest.js + PostgreSQL)
- Real-time sync (Socket.io)
- Bank account linking (Plaid API)
- Receipt OCR
- Export to CSV/PDF
- Recurring transactions
- Budget goals
- Notifications

## Contributing

This is a client-only implementation. Backend integration will be added in Phase 2.

## License

MIT License
