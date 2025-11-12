import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { TransactionWithDetails } from '../../_types';
import { formatDate } from '../../_utils/dateHelpers';
import { formatAmount } from '../../_utils/currencyHelpers';

interface RecentTransactionListProps {
  transactions: TransactionWithDetails[];
  currency: string;
  onTransactionPress: (transactionId: string) => void;
}

export function RecentTransactionList({
  transactions,
  currency,
  onTransactionPress,
}: RecentTransactionListProps) {
  const renderTransaction = ({ item }: { item: TransactionWithDetails }) => (
    <TouchableOpacity
      style={styles.transactionItem}
      onPress={() => onTransactionPress(item.id)}>
      <View style={styles.iconContainer}>
        <Text style={styles.icon}>{item.category?.icon || '💰'}</Text>
      </View>
      
      <View style={styles.transactionInfo}>
        <Text style={styles.categoryName}>{item.category?.name || 'Unknown'}</Text>
        <Text style={styles.description} numberOfLines={1}>
          {item.description || 'No description'}
        </Text>
        <Text style={styles.date}>{formatDate(item.date)}</Text>
      </View>
      
      <Text
        style={[
          styles.amount,
          item.type === 'income' ? styles.income : styles.expense,
        ]}>
        {formatAmount(item.amount, item.type, currency)}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Recent Transactions</Text>
      </View>
      
      <FlatList
        data={transactions}
        renderItem={renderTransaction}
        keyExtractor={(item) => item.id}
        scrollEnabled={false}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginHorizontal: 16,
    marginTop: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  header: {
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
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
    marginBottom: 2,
  },
  date: {
    fontSize: 12,
    color: '#9CA3AF',
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
  separator: {
    height: 1,
    backgroundColor: '#F3F4F6',
  },
});

