import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import { GlobalHeader } from '../_components/common/GlobalHeader';
import { EmptyState } from '../_components/home/EmptyState';
import { RecentTransactionList } from '../_components/home/RecentTransactionList';
import { SummaryCard } from '../_components/home/SummaryCard';
import { useAuthStore } from '../_store/useAuthStore';
import { useDataStore } from '../_store/useDataStore';
import { useSpaceStore } from '../_store/useSpaceStore';
import { TransactionWithDetails } from '../_types';
import { getEndOfMonth, getStartOfMonth } from '../_utils/dateHelpers';

export default function HomeScreen() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const { currentSpaceId, getCurrentSpace, loadSpaces } = useSpaceStore();
  const { transactions, categories, loadTransactions, loadCategories } = useDataStore();
  const [refreshing, setRefreshing] = useState(false);
  const currentSpace = getCurrentSpace();

  useEffect(() => {
    if (user && !currentSpaceId) {
      loadSpaces(user.id);
    }
  }, [user, currentSpaceId, loadSpaces]);

  useEffect(() => {
    if (currentSpaceId) {
      loadTransactions(currentSpaceId);
      loadCategories(currentSpaceId);
    }
  }, [currentSpaceId, loadTransactions, loadCategories]);

  const onRefresh = async () => {
    if (!currentSpaceId) return;
    
    setRefreshing(true);
    await loadTransactions(currentSpaceId);
    await loadCategories(currentSpaceId);
    setRefreshing(false);
  };

  // Calculate this month's summary
  const now = new Date();
  const startOfMonth = getStartOfMonth(now);
  const endOfMonth = getEndOfMonth(now);

  const thisMonthTransactions = transactions.filter((tx) => {
    const txDate = new Date(tx.date);
    return txDate >= startOfMonth && txDate <= endOfMonth;
  });

  const totalIncome = thisMonthTransactions
    .filter((tx) => tx.type === 'income')
    .reduce((sum, tx) => sum + tx.amount, 0);

  const totalExpense = thisMonthTransactions
    .filter((tx) => tx.type === 'expense')
    .reduce((sum, tx) => sum + tx.amount, 0);

  // Get recent transactions with details
  const recentTransactions: TransactionWithDetails[] = transactions
    .slice(0, 10)
    .map((tx) => ({
      ...tx,
      category: categories.find((cat) => cat.id === tx.categoryId),
    }));

  const handleTransactionPress = (transactionId: string) => {
    router.push({
      pathname: '/_transaction/[id]',
      params: { id: transactionId },
    });
  };

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
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        {transactions.length === 0 ? (
          <EmptyState />
        ) : (
          <>
            <SummaryCard
              totalIncome={totalIncome}
              totalExpense={totalExpense}
              currency={currentSpace.currency}
            />
            <RecentTransactionList
              transactions={recentTransactions}
              currency={currentSpace.currency}
              onTransactionPress={handleTransactionPress}
            />
          </>
        )}
        <View style={styles.bottomPadding} />
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
  bottomPadding: {
    height: 100,
  },
});

