import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { formatCurrency } from '../../_utils/currencyHelpers';

interface SummaryCardProps {
  totalIncome: number;
  totalExpense: number;
  currency: string;
}

export function SummaryCard({ totalIncome, totalExpense, currency }: SummaryCardProps) {
  const netProfit = totalIncome - totalExpense;

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <View style={styles.item}>
          <Text style={styles.label}>Income</Text>
          <Text style={[styles.amount, styles.income]}>
            +{formatCurrency(totalIncome, currency)}
          </Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.item}>
          <Text style={styles.label}>Expense</Text>
          <Text style={[styles.amount, styles.expense]}>
            -{formatCurrency(totalExpense, currency)}
          </Text>
        </View>
      </View>
      
      <View style={styles.netContainer}>
        <Text style={styles.netLabel}>Net Profit</Text>
        <Text style={[
          styles.netAmount,
          netProfit >= 0 ? styles.income : styles.expense
        ]}>
          {netProfit >= 0 ? '+' : ''}{formatCurrency(netProfit, currency)}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 16,
    marginTop: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  item: {
    flex: 1,
    alignItems: 'center',
  },
  divider: {
    width: 1,
    backgroundColor: '#E5E7EB',
    marginHorizontal: 16,
  },
  label: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
  },
  amount: {
    fontSize: 20,
    fontWeight: '700',
  },
  income: {
    color: '#10B981',
  },
  expense: {
    color: '#EF4444',
  },
  netContainer: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  netLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
  },
  netAmount: {
    fontSize: 28,
    fontWeight: '700',
  },
});

