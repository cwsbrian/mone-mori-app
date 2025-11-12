import { create } from 'zustand';
import { Transaction, Category, TransactionWithDetails } from '../_types';
import { DataManager } from '../_utils/dataManager';

interface DataState {
  transactions: Transaction[];
  categories: Category[];
  isLoading: boolean;
  loadTransactions: (spaceId: string) => Promise<void>;
  loadCategories: (spaceId: string) => Promise<void>;
  addTransaction: (transaction: Transaction) => Promise<void>;
  updateTransaction: (id: string, updates: Partial<Transaction>) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
  addCategory: (category: Category) => Promise<void>;
  updateCategory: (id: string, updates: Partial<Category>) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
  getTransactionWithDetails: (id: string) => TransactionWithDetails | null;
  getTransactionsByDateRange: (startDate: Date, endDate: Date) => Transaction[];
  getCategoryById: (id: string) => Category | null;
}

export const useDataStore = create<DataState>((set, get) => ({
  transactions: [],
  categories: [],
  isLoading: false,

  loadTransactions: async (spaceId: string) => {
    try {
      set({ isLoading: true });
      const transactions = await DataManager.getTransactionsBySpaceId(spaceId);
      set({ transactions, isLoading: false });
    } catch (error) {
      console.error('Error loading transactions:', error);
      set({ isLoading: false });
    }
  },

  loadCategories: async (spaceId: string) => {
    try {
      const categories = await DataManager.getCategoriesBySpaceId(spaceId);
      set({ categories });
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  },

  addTransaction: async (transaction: Transaction) => {
    try {
      await DataManager.addTransaction(transaction);
      
      set((state) => ({
        transactions: [transaction, ...state.transactions].sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        ),
      }));

      // Simulate real-time sync notification
      console.log('Transaction added:', transaction.id);
    } catch (error) {
      console.error('Error adding transaction:', error);
    }
  },

  updateTransaction: async (id: string, updates: Partial<Transaction>) => {
    try {
      await DataManager.updateTransaction(id, updates);
      
      set((state) => ({
        transactions: state.transactions.map((tx) =>
          tx.id === id ? { ...tx, ...updates } : tx
        ),
      }));
    } catch (error) {
      console.error('Error updating transaction:', error);
    }
  },

  deleteTransaction: async (id: string) => {
    try {
      await DataManager.deleteTransaction(id);
      
      set((state) => ({
        transactions: state.transactions.filter((tx) => tx.id !== id),
      }));
    } catch (error) {
      console.error('Error deleting transaction:', error);
    }
  },

  addCategory: async (category: Category) => {
    try {
      await DataManager.addCategory(category);
      
      set((state) => ({
        categories: [...state.categories, category],
      }));
    } catch (error) {
      console.error('Error adding category:', error);
    }
  },

  updateCategory: async (id: string, updates: Partial<Category>) => {
    try {
      await DataManager.updateCategory(id, updates);
      
      set((state) => ({
        categories: state.categories.map((cat) =>
          cat.id === id ? { ...cat, ...updates } : cat
        ),
      }));
    } catch (error) {
      console.error('Error updating category:', error);
    }
  },

  deleteCategory: async (id: string) => {
    try {
      await DataManager.deleteCategory(id);
      
      set((state) => ({
        categories: state.categories.filter((cat) => cat.id !== id),
      }));
    } catch (error) {
      console.error('Error deleting category:', error);
    }
  },

  getTransactionWithDetails: (id: string) => {
    const { transactions, categories } = get();
    const transaction = transactions.find((tx) => tx.id === id);
    
    if (!transaction) return null;

    const category = categories.find((cat) => cat.id === transaction.categoryId);
    
    return {
      ...transaction,
      category,
    };
  },

  getTransactionsByDateRange: (startDate: Date, endDate: Date) => {
    const { transactions } = get();
    
    return transactions.filter((tx) => {
      const txDate = new Date(tx.date);
      return txDate >= startDate && txDate <= endDate;
    });
  },

  getCategoryById: (id: string) => {
    const { categories } = get();
    return categories.find((cat) => cat.id === id) || null;
  },
}));

