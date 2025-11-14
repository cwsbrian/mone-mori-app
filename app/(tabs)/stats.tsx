import React, { useLayoutEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from 'expo-router';
import { PieChart } from 'react-native-chart-kit';
import { AccountDrawer } from '../_components/common/AccountDrawer';
import { EmptyState } from '../_components/home/EmptyState';
import { useSpaceStore } from '../_store/useSpaceStore';
import { useDataStore } from '../_store/useDataStore';
import { getStartOfMonth, getEndOfMonth, formatDate } from '../_utils/dateHelpers';
import { formatCurrency } from '../_utils/currencyHelpers';

const { width } = Dimensions.get('window');

export default function StatsScreen() {
  const navigation = useNavigation();
  const { getCurrentSpace } = useSpaceStore();
  const { transactions, categories } = useDataStore();
  const [isAccountDrawerOpen, setIsAccountDrawerOpen] = useState(false);
  const currentSpace = getCurrentSpace();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          onPress={() => setIsAccountDrawerOpen(true)}
          style={{ marginRight: 16 }}>
          <Ionicons name="ellipsis-vertical" size={24} color="#1F2937" />
        </TouchableOpacity>
      ),
    });
  }, [navigation, setIsAccountDrawerOpen]);

  // Period selection
  const [startDate, setStartDate] = useState(getStartOfMonth(new Date()));
  const [endDate, setEndDate] = useState(getEndOfMonth(new Date()));

  // Filter transactions by period
  const periodTransactions = transactions.filter((tx) => {
    const txDate = new Date(tx.date);
    return txDate >= startDate && txDate <= endDate;
  });

  // Calculate category breakdown for expenses
  const categoryBreakdown: { [key: string]: number } = {};
  const expenseTransactions = periodTransactions.filter((tx) => tx.type === 'expense');

  expenseTransactions.forEach((tx) => {
    const category = categories.find((cat) => cat.id === tx.categoryId);
    const categoryName = category?.name || 'Unknown';
    categoryBreakdown[categoryName] = (categoryBreakdown[categoryName] || 0) + tx.amount;
  });

  // Prepare pie chart data
  const pieChartData = Object.entries(categoryBreakdown)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([name, amount], index) => {
      const colors = ['#4F46E5', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];
      return {
        name,
        amount,
        color: colors[index % colors.length],
        legendFontColor: '#6B7280',
        legendFontSize: 12,
      };
    });

  // Calculate totals
  const totalIncome = periodTransactions
    .filter((tx) => tx.type === 'income')
    .reduce((sum, tx) => sum + tx.amount, 0);

  const totalExpense = periodTransactions
    .filter((tx) => tx.type === 'expense')
    .reduce((sum, tx) => sum + tx.amount, 0);

  const handleThisMonth = () => {
    const now = new Date();
    setStartDate(getStartOfMonth(now));
    setEndDate(getEndOfMonth(now));
  };

  const handleLastMonth = () => {
    const now = new Date();
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    setStartDate(getStartOfMonth(lastMonth));
    setEndDate(getEndOfMonth(lastMonth));
  };

  if (!currentSpace) {
    return (
      <View style={styles.container}>
        <EmptyState
          title="No Space Selected"
          message="Please select or create a space to get started"
          icon="albums-outline"
        />
        <AccountDrawer isOpen={isAccountDrawerOpen} onClose={() => setIsAccountDrawerOpen(false)} />
      </View>
    );
  }

  if (periodTransactions.length === 0) {
    return (
      <View style={styles.container}>
        <EmptyState
          title="No Data Available"
          message="We'll show you great statistics here as data accumulates"
          icon="bar-chart-outline"
        />
        <AccountDrawer isOpen={isAccountDrawerOpen} onClose={() => setIsAccountDrawerOpen(false)} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Period Selector */}
        <View style={styles.periodSelector}>
          <Text style={styles.sectionTitle}>Period</Text>
          <View style={styles.periodButtons}>
            <TouchableOpacity style={styles.periodButton} onPress={handleThisMonth}>
              <Text style={styles.periodButtonText}>This Month</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.periodButton} onPress={handleLastMonth}>
              <Text style={styles.periodButtonText}>Last Month</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.periodText}>
            {formatDate(startDate)} - {formatDate(endDate)}
          </Text>
        </View>

        {/* Summary Cards */}
        <View style={styles.summaryContainer}>
          <View style={[styles.summaryCard, styles.incomeCard]}>
            <Text style={styles.summaryLabel}>Total Income</Text>
            <Text style={[styles.summaryAmount, styles.incomeText]}>
              {formatCurrency(totalIncome, currentSpace.currency)}
            </Text>
          </View>
          <View style={[styles.summaryCard, styles.expenseCard]}>
            <Text style={styles.summaryLabel}>Total Expense</Text>
            <Text style={[styles.summaryAmount, styles.expenseText]}>
              {formatCurrency(totalExpense, currentSpace.currency)}
            </Text>
          </View>
        </View>

        {/* Category Pie Chart */}
        {pieChartData.length > 0 && (
          <View style={styles.chartContainer}>
            <Text style={styles.sectionTitle}>Expense by Category</Text>
            <PieChart
              data={pieChartData}
              width={width - 32}
              height={220}
              chartConfig={{
                color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              }}
              accessor="amount"
              backgroundColor="transparent"
              paddingLeft="15"
              absolute
            />
          </View>
        )}

        {/* Category List */}
        <View style={styles.categoryList}>
          <Text style={styles.sectionTitle}>Category Breakdown</Text>
          {Object.entries(categoryBreakdown)
            .sort((a, b) => b[1] - a[1])
            .map(([categoryName, amount]) => {
              const percentage = ((amount / totalExpense) * 100).toFixed(1);
              const category = categories.find((cat) => cat.name === categoryName);
              
              return (
                <View key={categoryName} style={styles.categoryItem}>
                  <View style={styles.categoryLeft}>
                    <Text style={styles.categoryIcon}>{category?.icon || '💰'}</Text>
                    <Text style={styles.categoryName}>{categoryName}</Text>
                  </View>
                  <View style={styles.categoryRight}>
                    <Text style={styles.categoryAmount}>
                      {formatCurrency(amount, currentSpace.currency)}
                    </Text>
                    <Text style={styles.categoryPercentage}>{percentage}%</Text>
                  </View>
                </View>
              );
            })}
        </View>

        <View style={styles.bottomPadding} />
      </ScrollView>
      <AccountDrawer isOpen={isAccountDrawerOpen} onClose={() => setIsAccountDrawerOpen(false)} />
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
  periodSelector: {
    backgroundColor: '#fff',
    margin: 16,
    padding: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 12,
  },
  periodButtons: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  periodButton: {
    flex: 1,
    backgroundColor: '#4F46E5',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  periodButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  periodText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
  summaryContainer: {
    flexDirection: 'row',
    gap: 12,
    marginHorizontal: 16,
    marginBottom: 16,
  },
  summaryCard: {
    flex: 1,
    padding: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  incomeCard: {
    backgroundColor: '#ECFDF5',
  },
  expenseCard: {
    backgroundColor: '#FEF2F2',
  },
  summaryLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 8,
  },
  summaryAmount: {
    fontSize: 20,
    fontWeight: '700',
  },
  incomeText: {
    color: '#10B981',
  },
  expenseText: {
    color: '#EF4444',
  },
  chartContainer: {
    backgroundColor: '#fff',
    margin: 16,
    padding: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  categoryList: {
    backgroundColor: '#fff',
    margin: 16,
    padding: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  categoryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  categoryLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  categoryIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  categoryName: {
    fontSize: 16,
    color: '#1F2937',
    fontWeight: '500',
  },
  categoryRight: {
    alignItems: 'flex-end',
  },
  categoryAmount: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 2,
  },
  categoryPercentage: {
    fontSize: 12,
    color: '#6B7280',
  },
  bottomPadding: {
    height: 100,
  },
});

