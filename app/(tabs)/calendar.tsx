import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { GlobalHeader } from '../_components/common/GlobalHeader';
import { EmptyState } from '../_components/home/EmptyState';
import { useSpaceStore } from '../_store/useSpaceStore';
import { useDataStore } from '../_store/useDataStore';
import { formatCalendarDate, formatDate } from '../_utils/dateHelpers';
import { formatAmount } from '../_utils/currencyHelpers';
import { TransactionWithDetails } from '../_types';

export default function CalendarScreen() {
  const { getCurrentSpace } = useSpaceStore();
  const { transactions, categories } = useDataStore();
  const [selectedDate, setSelectedDate] = useState(formatCalendarDate(new Date()));
  const currentSpace = getCurrentSpace();

  // Create marked dates object for calendar
  const markedDates: { [key: string]: any } = {};
  
  transactions.forEach((tx) => {
    const date = formatCalendarDate(new Date(tx.date));
    if (!markedDates[date]) {
      markedDates[date] = { marked: true, dotColor: '#4F46E5' };
    }
  });

  // Highlight selected date
  if (selectedDate) {
    markedDates[selectedDate] = {
      ...markedDates[selectedDate],
      selected: true,
      selectedColor: '#4F46E5',
    };
  }

  // Get transactions for selected date
  const selectedDateTransactions: TransactionWithDetails[] = transactions
    .filter((tx) => formatCalendarDate(new Date(tx.date)) === selectedDate)
    .map((tx) => ({
      ...tx,
      category: categories.find((cat) => cat.id === tx.categoryId),
    }));

  // Calculate daily total
  const dailyTotal = selectedDateTransactions.reduce((sum, tx) => {
    return tx.type === 'income' ? sum + tx.amount : sum - tx.amount;
  }, 0);

  if (!currentSpace) {
    return (
      <View style={styles.container}>
        <GlobalHeader />
        <EmptyState
          title="No Space Selected"
          message="Please select or create a space to get started"
          icon="albums-outline"
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <GlobalHeader />
      <ScrollView style={styles.scrollView}>
        <Calendar
          current={selectedDate}
          onDayPress={(day) => setSelectedDate(day.dateString)}
          markedDates={markedDates}
          theme={{
            backgroundColor: '#ffffff',
            calendarBackground: '#ffffff',
            textSectionTitleColor: '#6B7280',
            selectedDayBackgroundColor: '#4F46E5',
            selectedDayTextColor: '#ffffff',
            todayTextColor: '#4F46E5',
            dayTextColor: '#1F2937',
            textDisabledColor: '#D1D5DB',
            dotColor: '#4F46E5',
            selectedDotColor: '#ffffff',
            arrowColor: '#4F46E5',
            monthTextColor: '#1F2937',
            textMonthFontWeight: '700',
            textDayFontSize: 16,
            textMonthFontSize: 18,
          }}
        />

        <View style={styles.dailySection}>
          <View style={styles.dailyHeader}>
            <Text style={styles.dailyTitle}>
              {formatDate(selectedDate)}
            </Text>
            {selectedDateTransactions.length > 0 && (
              <Text
                style={[
                  styles.dailyTotal,
                  dailyTotal >= 0 ? styles.income : styles.expense,
                ]}>
                {dailyTotal >= 0 ? '+' : ''}
                {dailyTotal.toFixed(2)} {currentSpace.currency}
              </Text>
            )}
          </View>

          {selectedDateTransactions.length === 0 ? (
            <View style={styles.emptyDay}>
              <Text style={styles.emptyDayText}>No transactions on this day</Text>
            </View>
          ) : (
            <View style={styles.transactionList}>
              {selectedDateTransactions.map((tx) => (
                <View key={tx.id} style={styles.transactionItem}>
                  <View style={styles.iconContainer}>
                    <Text style={styles.icon}>{tx.category?.icon || '💰'}</Text>
                  </View>
                  
                  <View style={styles.transactionInfo}>
                    <Text style={styles.categoryName}>
                      {tx.category?.name || 'Unknown'}
                    </Text>
                    <Text style={styles.description} numberOfLines={1}>
                      {tx.description || 'No description'}
                    </Text>
                  </View>
                  
                  <Text
                    style={[
                      styles.amount,
                      tx.type === 'income' ? styles.income : styles.expense,
                    ]}>
                    {formatAmount(tx.amount, tx.type, currentSpace.currency)}
                  </Text>
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  scrollView: {
    flex: 1,
  },
  dailySection: {
    backgroundColor: '#fff',
    marginTop: 16,
    marginHorizontal: 16,
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    marginBottom: 100,
  },
  dailyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  dailyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
  },
  dailyTotal: {
    fontSize: 18,
    fontWeight: '700',
  },
  emptyDay: {
    padding: 32,
    alignItems: 'center',
  },
  emptyDayText: {
    fontSize: 14,
    color: '#9CA3AF',
  },
  transactionList: {
    gap: 12,
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  icon: {
    fontSize: 24,
  },
  transactionInfo: {
    flex: 1,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 2,
  },
  description: {
    fontSize: 14,
    color: '#6B7280',
  },
  amount: {
    fontSize: 16,
    fontWeight: '700',
    marginLeft: 12,
  },
  income: {
    color: '#10B981',
  },
  expense: {
    color: '#EF4444',
  },
});

