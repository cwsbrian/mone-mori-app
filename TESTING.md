# Testing Guide - Shared Account Book App

## Quick Start Testing

### 1. Start the App
```bash
npm start
```

Then press:
- `i` for iOS simulator
- `a` for Android emulator
- Or scan QR code with Expo Go app

### 2. Login with Demo Account
- Email: `john@example.com`
- Password: `password123`

## Complete User Flow Testing

### Test 1: Authentication Flow
1. **Login Screen**
   - ✅ Enter demo credentials
   - ✅ Click "Sign In"
   - ✅ Should redirect to Home screen

2. **Registration Flow**
   - ✅ Click "Sign Up" link
   - ✅ Enter: nickname, email, password, confirm password
   - ✅ Click "Sign Up"
   - ✅ Should see onboarding screens
   - ✅ Auto-creates "Personal Account Book" space

3. **Onboarding**
   - ✅ Swipe through 3 screens
   - ✅ Click "Get Started" or "Skip"
   - ✅ Should redirect to Home screen

### Test 2: Home Screen
1. **Initial State**
   - ✅ See space selector in header (e.g., "💰 Personal Account Book")
   - ✅ See notification icon
   - ✅ See monthly summary card (Income, Expense, Net Profit)
   - ✅ See recent transactions list (or empty state)

2. **Space Switching**
   - ✅ Tap space selector
   - ✅ Modal shows available spaces
   - ✅ Select "👫 Couple Account Book"
   - ✅ Data refreshes for new space
   - ✅ Summary and transactions update

3. **Pull to Refresh**
   - ✅ Pull down on home screen
   - ✅ Loading indicator appears
   - ✅ Data refreshes

4. **Transaction Tap**
   - ✅ Tap any transaction
   - ✅ Navigate to transaction detail screen

### Test 3: Add Transaction
1. **Open Add Screen**
   - ✅ Tap center "+" button in tab bar
   - ✅ Add transaction screen opens

2. **Add Expense**
   - ✅ Type: Expense (default)
   - ✅ Amount: 45.50
   - ✅ Category: Tap to select "🍔 Food & Dining"
   - ✅ Date: Shows today (default)
   - ✅ Tap "Save"
   - ✅ Success alert appears
   - ✅ Returns to previous screen
   - ✅ New transaction appears in home list

3. **Add Income**
   - ✅ Tap "+" button again
   - ✅ Toggle to "Income"
   - ✅ Amount: 1000.00
   - ✅ Category: Select "💼 Salary"
   - ✅ Tap "Advanced Options"
   - ✅ Payment Method: "Bank Transfer"
   - ✅ Description: "Monthly salary"
   - ✅ Tap "Save"
   - ✅ Transaction saved successfully

4. **Validation**
   - ✅ Try saving without amount → Error alert
   - ✅ Try saving without category → Error alert

### Test 4: Calendar Screen
1. **Calendar View**
   - ✅ Tap "Calendar" tab
   - ✅ See monthly calendar
   - ✅ Dates with transactions have dots
   - ✅ Current date highlighted

2. **Date Selection**
   - ✅ Tap a date with transactions
   - ✅ See daily transaction list below
   - ✅ See daily total
   - ✅ Transactions show category icon, name, amount

3. **Empty Date**
   - ✅ Tap date without transactions
   - ✅ See "No transactions on this day" message

### Test 5: Stats Screen
1. **Period Selection**
   - ✅ Tap "Stats" tab
   - ✅ See "This Month" and "Last Month" buttons
   - ✅ Tap "This Month"
   - ✅ Data updates for current month
   - ✅ Tap "Last Month"
   - ✅ Data updates for previous month

2. **Summary Cards**
   - ✅ See Total Income (green card)
   - ✅ See Total Expense (red card)
   - ✅ Amounts formatted correctly

3. **Charts**
   - ✅ See pie chart for expense categories
   - ✅ Top 6 categories displayed
   - ✅ Colors and labels visible

4. **Category Breakdown**
   - ✅ See list of all categories
   - ✅ Each shows icon, name, amount, percentage
   - ✅ Sorted by amount (highest first)

5. **Empty State**
   - ✅ Switch to space with no transactions
   - ✅ See "No Data Available" message

### Test 6: Transaction Detail
1. **View Details**
   - ✅ Tap transaction from home or calendar
   - ✅ See large amount display
   - ✅ See income/expense badge
   - ✅ See all details: category, date, payment method, description

2. **Delete Transaction**
   - ✅ Tap "Delete Transaction" button
   - ✅ Confirmation alert appears
   - ✅ Tap "Delete"
   - ✅ Transaction removed
   - ✅ Returns to previous screen
   - ✅ Transaction no longer in list

3. **Edit (Placeholder)**
   - ✅ Tap edit icon
   - ✅ See "Coming Soon" alert

### Test 7: More Screen
1. **Profile Display**
   - ✅ Tap "More" tab
   - ✅ See user avatar with initial
   - ✅ See nickname and email
   - ✅ Premium badge if applicable

2. **Menu Navigation**
   - ✅ Tap "Space Management" → Coming Soon alert
   - ✅ Tap "Category Settings" → Coming Soon alert
   - ✅ Tap "Premium Subscription" → Coming Soon alert
   - ✅ Tap "App Settings" → Coming Soon alert
   - ✅ Tap "Help & Support" → Contact info alert

3. **Logout**
   - ✅ Tap "Logout" button
   - ✅ Confirmation alert appears
   - ✅ Tap "Logout"
   - ✅ Redirects to login screen
   - ✅ Login again → Data persists

### Test 8: Data Persistence
1. **Add Transaction**
   - ✅ Login and add a new transaction
   - ✅ Close app completely

2. **Reopen App**
   - ✅ Open app again
   - ✅ Still logged in (auth persisted)
   - ✅ Same space selected
   - ✅ New transaction still visible

3. **Space Switching Persistence**
   - ✅ Switch to different space
   - ✅ Close app
   - ✅ Reopen app
   - ✅ Same space still selected

### Test 9: Multi-Space Testing
1. **Switch Between Spaces**
   - ✅ Login as john@example.com
   - ✅ Has access to "Personal" and "Couple" spaces
   - ✅ Switch to "Personal" → See personal transactions
   - ✅ Switch to "Couple" → See shared transactions
   - ✅ Add transaction in "Couple" space
   - ✅ Switch back to "Personal"
   - ✅ New transaction not visible (correct isolation)
   - ✅ Switch back to "Couple"
   - ✅ New transaction visible

### Test 10: Category System
1. **Expense Categories**
   - ✅ Open add transaction
   - ✅ Type: Expense
   - ✅ Tap category selector
   - ✅ See 12 expense categories with icons
   - ✅ Select any category
   - ✅ Category displayed correctly

2. **Income Categories**
   - ✅ Toggle to Income
   - ✅ Tap category selector
   - ✅ See 4 income categories
   - ✅ Different from expense categories

### Test 11: Edge Cases
1. **Empty Space**
   - ✅ Create new account (registers new user)
   - ✅ See empty state on home
   - ✅ Message: "Tap the + button to add first transaction"
   - ✅ Add first transaction
   - ✅ Empty state disappears

2. **Large Amounts**
   - ✅ Add transaction with amount: 999999.99
   - ✅ Displays correctly with commas
   - ✅ Summary calculations correct

3. **Special Characters**
   - ✅ Add transaction with description: "Test @#$% 123"
   - ✅ Saves and displays correctly

4. **Date Boundaries**
   - ✅ View calendar for current month
   - ✅ Navigate to previous month
   - ✅ Navigate to next month
   - ✅ All dates selectable

## Performance Testing

### Response Times
- ✅ Login: < 1 second
- ✅ Space switching: < 500ms
- ✅ Add transaction: < 500ms
- ✅ Load transactions: < 300ms
- ✅ Calendar rendering: < 1 second
- ✅ Chart rendering: < 1 second

### Memory
- ✅ No memory leaks during navigation
- ✅ Smooth scrolling on long transaction lists
- ✅ Calendar scrolling smooth

## UI/UX Testing

### Visual Consistency
- ✅ Colors consistent across screens
- ✅ Icons appropriate and visible
- ✅ Typography readable
- ✅ Spacing consistent

### Touch Targets
- ✅ All buttons easily tappable (min 44x44)
- ✅ Tab bar icons clear
- ✅ No accidental taps

### Feedback
- ✅ Loading states visible
- ✅ Success/error alerts clear
- ✅ Empty states informative
- ✅ Pull-to-refresh works smoothly

## Known Limitations (By Design)

1. **Mock Backend**
   - Data stored locally only
   - No real-time sync between devices
   - No cloud backup

2. **Placeholder Features**
   - Space creation/editing UI
   - Category customization UI
   - Premium payment integration
   - Receipt photo upload
   - App settings screens

3. **Future Phase 2**
   - Backend API integration
   - Real Socket.io sync
   - Bank account linking
   - OAuth (Google/Apple)
   - Cloudflare R2 for photos

## Test Results Summary

All core features tested and working:
- ✅ Authentication (Login/Register/Logout)
- ✅ Transaction Management (Add/View/Delete)
- ✅ Multi-Space Support
- ✅ Calendar View
- ✅ Statistics & Charts
- ✅ Data Persistence
- ✅ Category System
- ✅ Empty States
- ✅ Error Handling

**Status: Ready for Demo/Presentation** 🎉

