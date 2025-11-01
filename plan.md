# Shared Account Book App - Detailed Screen Design Document (v1.0)

This document defines the actual screen structure, navigation flow, core components, and state management for a React Native application based on the planning in SharedAccountBook-Plan.md.

## 1. Navigation Architecture

**Main Router:** Uses React Navigation (@react-navigation/native).

**Structure:** The app branches into two main stacks based on authentication state (isLoggedIn).

- **Auth Stack:** Stack for users who are not logged in.
- **Main Stack:** Stack containing the app's core features after login.

```javascript
// App.js (pseudo code)
const App = () => {
  const { isLoggedIn } = useAuthStore(); // Query authentication state from Zustand store

  return (
    <NavigationContainer>
      {isLoggedIn ? <MainStack /> : <AuthStack />}
    </NavigationContainer>
  );
};
```

## 2. Main Stack Detailed Structure

The MainStack consists of a **Global Header** shared by HomeScreen, CalendarScreen, and StatsScreen, and a **Bottom Tab Bar** for screen switching.

### 2.1. Global Header

Commonly displayed at the top of the HomeScreen, CalendarScreen, and StatsScreen tab screens.

**Components:**

- **CurrentSpaceSelector:** (Header left/center) Dropdown to select/switch the currently active account book space. (e.g., "👫 Couple Account Book ▾")
- **NotificationIcon:** (Header right) Notification icon (e.g., space invitation notifications, etc.)

### 2.2. Core Navigation: Bottom Tab Bar

The core of MainStack is the Bottom Tab Navigator. It consists of 4 tabs and 1 central action button to allow users to quickly switch between the app's main features.

#### Tab 1: Home

- **Icon:** Home
- **Function:** Summary information for the current account book space (this month's expenses/income), recent transactions.

#### Tab 2: Calendar

- **Icon:** Calendar
- **Function:** Visually check daily expense/income transactions through calendar view. (Can switch to list view)

#### Tab 3: (Center Button) Add Transaction

- **Icon:** Plus (large and emphasized style)
- **Function:** Opens a **'Bottom Sheet'** (not a tab screen) to quickly input new transaction details.

#### Tab 4: Stats

- **Icon:** BarChart
- **Function:** Provides the core feature of 'period-based analysis' reports.

#### Tab 5: More

- **Icon:** DotsHorizontal (or similar 'more' icon)
- **Function:** Space management, category settings, my information, premium payment, logout. (This screen may not use the global header)

## 3. Screen Definitions

### 3.1. Auth Stack

- **LoginScreen:** Provides email/password login, social login (Google, Apple) buttons. (Uses gluestack-ui Input, Button)
- **RegisterScreen:** Accepts email, password, nickname, etc. for registration. (Automatically creates 1 'Personal Account Book' space upon completion)
- **OnboardingScreen:** (Displayed once on registration/first login) Summarizes the app's core features (space concept, '+' button) in 2-3 pages.

### 3.2. Main Stack - Tab Screens

#### HomeScreen (Home)

**Components:**

- **SummaryCard:** Summary of total income, total expenses, and net profit for this month. (gluestack-ui Card)
- **RecentTransactionList:** List of the most recent 5-10 transactions.
- **Empty State:** Guide display that encourages users to tap the center '+' button to add the first transaction when there are no transactions in the space.

#### CalendarScreen (Calendar)

**Components:**

- **CalendarView:** (e.g., react-native-calendars) Displays total expenses by date.
- **DailyTransactionList:** Displays transactions for the selected date at the bottom when a specific date is selected from the calendar.
- **ViewToggleButton:** Button to toggle between calendar view <-> list view (TransactionListScreen).

#### StatsScreen (Statistics)

**Components:**

- **CustomPeriodPicker:** (Core) Date Picker to select 'start date' ~ 'end date'. Includes preset buttons like 'This Month', 'Last Week', etc.
- **CategoryPieChart:** Category-based expense ratio for the selected period (pie chart).
- **TrendBarChart:** Daily/weekly/monthly expense trends for the selected period (bar chart).
- **MemberSummary:** Spending status by member.
- **Empty State:** Guide message displayed when there is insufficient data to analyze, such as "We'll show you great statistics here as data accumulates."

#### MoreScreen (More)

**Components:**

- **ProfileCard:** My nickname, email, profile edit button.
- **MenuList:**
  - "Account Book Space Management" -> Navigate to SpaceListScreen.
  - "Category Settings" -> Navigate to CategorySettingsScreen.
  - "Premium Subscription" -> Navigate to PremiumScreen.
  - "App Settings" -> Navigate to AppSettingsScreen.
  - "Logout" button.

### 3.3. Main Stack - Modal & Common Screens

#### AddTransactionSheet (Add Transaction Bottom Sheet)

**Trigger:** When the center tab button is clicked, gluestack-ui's Actionsheet (bottom sheet) slides up from the bottom of the screen.

**Components:**

- Income/expense toggle button.
- **(Core UX)** Input fields simplified to encourage quick input:
  - **Required fields (shown by default):** Amount, category.
  - **Default fields (editable):** Date (default: today), spender (default: 'me').
  - **Optional fields ('detailed input' toggle):** Payment method, content (memo), receipt photo attachment.

#### TransactionDetailScreen (Transaction Detail)

- **Trigger:** When a specific transaction is clicked from HomeScreen or CalendarScreen.
- **Function:** View, edit, and delete transaction details.

#### SpaceListScreen (Space List)

- **Function:** List of account book spaces I belong to, create new space, join via invitation code. (Inherits 'default currency' from AppSettingsScreen upon creation)

#### SpaceSettingsScreen (Space Settings)

- **Function:** Change space name, invite members (issue invitation code), manage members (permissions, removal), change space currency (Premium feature), delete space.

#### CategorySettingsScreen (Category Settings)

- **Function:** (Core UX) Upon registration, 10-15 default categories such as 'Food', 'Transportation', 'Leisure' are automatically provided. Users can edit/delete these default categories, or add custom categories and change their order.

#### PremiumScreen (Premium Subscription)

- **Function:** Guides premium subscription plans and in-app payment (subscription). Free users can only use 1 space and ads are displayed in the app.

**Premium Features:**

- Ad removal
- Unlimited space creation and participation
- Automatic transaction updates through bank linking (Phase 2 feature)
- Per-space currency change feature

#### AppSettingsScreen (App Settings) (New)

- **Function:** Groups app-wide settings by section.

**Section 1: Account**

- Change email
- Change password
- Manage connected social accounts (Google, Apple)
- Account deletion

**Section 2: App**

- Notification settings (Space invitations, transaction registration, reports, marketing notifications On/Off)
- Screen theme (Light/Dark/System default)
- App lock (Biometric authentication or PIN)
- Default currency setting (Global Default Currency) (New spaces inherit this currency)
- Week start day (Sunday/Monday)

**Section 3: Info**

- Announcements
- Customer Service / 1:1 Inquiry
- Terms of Service
- Privacy Policy
- App version information

## 4. Global State Management (Zustand)

Uses Zustand stores to manage important data throughout the app.

### useAuthStore:

- **isLoggedIn:** (boolean) Login status.
- **user:** (object) Current logged-in user information (ID, email, nickname).
- **token:** (string) JWT authentication token.

### useSpaceStore:

- **spaces:** (array) List of account book spaces I belong to.
- **currentSpaceId:** (string) (Very important) ID of the currently selected account book space. (When this ID changes, data on the Home, Calendar, and Stats screens must all refresh).

### useDataStore:

- **transactions:** (array) Transaction history for the current currentSpaceId.
- **categories:** (array) Category list for the current currentSpaceId.

## 5. Real-time Synchronization (Socket.io) Flow

**Scenario:** User A in a 'Couple' space enters a 10,000 won expense.

1. **Client (A):** Click 'Save' in AddTransactionSheet.
2. **Client (A):** `socket.emit('add_transaction', { spaceId: 'couple', amount: 10000, ... })`
3. **Server (Nest.js):** Sends `on_transaction_added` event to all clients in the spaceId: 'couple' room.
4. **Client (B):** (User B who had the app open) `socket.on('on_transaction_added', (newTx) => { ... })`
5. **Client (B):** `useDataStore.setState(prev => ({ transactions: [newTx, ...prev.transactions] }))`
6. **UI (B):** User B's HomeScreen list is immediately refreshed due to Zustand state change.

## 6. Future Plans (Phase 2)

### 6.1. Bank Linking

- **Goal:** (Premium feature) Link user's bank/card company accounts to automatically load and categorize transaction history.
- **Tech Stack:** Considering using Plaid API or similar Open Banking solutions.

**Target Banks (Based on Canada):**

- **Top 5 Banks:** RBC, TD Bank, Scotiabank, BMO, CIBC
- **Other Major Institutions:** American Express, Coast Capital, National Bank of Canada, Desjardins Group, Tangerine, Simplii Financial, etc.
