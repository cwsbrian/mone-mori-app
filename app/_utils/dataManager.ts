import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, Space, Category, Transaction } from '../_types';

// Import mock data
import mockUsersData from '../_data/mockUsers.json';
import mockSpacesData from '../_data/mockSpaces.json';
import mockCategoriesData from '../_data/mockCategories.json';
import mockTransactionsData from '../_data/mockTransactions.json';

const STORAGE_KEYS = {
  USERS: '@users',
  SPACES: '@spaces',
  CATEGORIES: '@categories',
  TRANSACTIONS: '@transactions',
  INITIALIZED: '@data_initialized',
};

export class DataManager {
  // Initialize data from JSON files if not already initialized
  static async initialize(): Promise<void> {
    try {
      const initialized = await AsyncStorage.getItem(STORAGE_KEYS.INITIALIZED);
      
      if (!initialized) {
        // Load mock data into AsyncStorage
        await AsyncStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(mockUsersData));
        await AsyncStorage.setItem(STORAGE_KEYS.SPACES, JSON.stringify(mockSpacesData));
        await AsyncStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(mockCategoriesData));
        await AsyncStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(mockTransactionsData));
        await AsyncStorage.setItem(STORAGE_KEYS.INITIALIZED, 'true');
        console.log('Data initialized from mock JSON files');
      }
    } catch (error) {
      console.error('Error initializing data:', error);
    }
  }

  // User methods
  static async getUsers(): Promise<User[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.USERS);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error getting users:', error);
      return [];
    }
  }

  static async getUserById(id: string): Promise<User | null> {
    const users = await this.getUsers();
    return users.find(user => user.id === id) || null;
  }

  static async getUserByEmail(email: string): Promise<User | null> {
    const users = await this.getUsers();
    return users.find(user => user.email === email) || null;
  }

  static async addUser(user: User): Promise<void> {
    const users = await this.getUsers();
    users.push(user);
    await AsyncStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  }

  static async updateUser(id: string, updates: Partial<User>): Promise<void> {
    const users = await this.getUsers();
    const index = users.findIndex(user => user.id === id);
    if (index !== -1) {
      users[index] = { ...users[index], ...updates };
      await AsyncStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    }
  }

  // Space methods
  static async getSpaces(): Promise<Space[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.SPACES);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error getting spaces:', error);
      return [];
    }
  }

  static async getSpaceById(id: string): Promise<Space | null> {
    const spaces = await this.getSpaces();
    return spaces.find(space => space.id === id) || null;
  }

  static async getSpacesByUserId(userId: string): Promise<Space[]> {
    const spaces = await this.getSpaces();
    return spaces.filter(space => space.memberIds.includes(userId));
  }

  static async addSpace(space: Space): Promise<void> {
    const spaces = await this.getSpaces();
    spaces.push(space);
    await AsyncStorage.setItem(STORAGE_KEYS.SPACES, JSON.stringify(spaces));
  }

  static async updateSpace(id: string, updates: Partial<Space>): Promise<void> {
    const spaces = await this.getSpaces();
    const index = spaces.findIndex(space => space.id === id);
    if (index !== -1) {
      spaces[index] = { ...spaces[index], ...updates };
      await AsyncStorage.setItem(STORAGE_KEYS.SPACES, JSON.stringify(spaces));
    }
  }

  static async deleteSpace(id: string): Promise<void> {
    const spaces = await this.getSpaces();
    const filtered = spaces.filter(space => space.id !== id);
    await AsyncStorage.setItem(STORAGE_KEYS.SPACES, JSON.stringify(filtered));
    
    // Also delete all transactions for this space
    const transactions = await this.getTransactions();
    const filteredTransactions = transactions.filter(tx => tx.spaceId !== id);
    await AsyncStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(filteredTransactions));
  }

  // Category methods
  static async getCategories(): Promise<Category[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.CATEGORIES);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error getting categories:', error);
      return [];
    }
  }

  static async getCategoriesBySpaceId(spaceId: string): Promise<Category[]> {
    const categories = await this.getCategories();
    // Return default categories + space-specific categories
    return categories.filter(cat => cat.isDefault || cat.spaceId === spaceId);
  }

  static async addCategory(category: Category): Promise<void> {
    const categories = await this.getCategories();
    categories.push(category);
    await AsyncStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
  }

  static async updateCategory(id: string, updates: Partial<Category>): Promise<void> {
    const categories = await this.getCategories();
    const index = categories.findIndex(cat => cat.id === id);
    if (index !== -1) {
      categories[index] = { ...categories[index], ...updates };
      await AsyncStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
    }
  }

  static async deleteCategory(id: string): Promise<void> {
    const categories = await this.getCategories();
    const filtered = categories.filter(cat => cat.id !== id);
    await AsyncStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(filtered));
  }

  // Transaction methods
  static async getTransactions(): Promise<Transaction[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error getting transactions:', error);
      return [];
    }
  }

  static async getTransactionsBySpaceId(spaceId: string): Promise<Transaction[]> {
    const transactions = await this.getTransactions();
    return transactions.filter(tx => tx.spaceId === spaceId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  static async getTransactionById(id: string): Promise<Transaction | null> {
    const transactions = await this.getTransactions();
    return transactions.find(tx => tx.id === id) || null;
  }

  static async addTransaction(transaction: Transaction): Promise<void> {
    const transactions = await this.getTransactions();
    transactions.push(transaction);
    await AsyncStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));
    
    // Simulate real-time sync delay
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  static async updateTransaction(id: string, updates: Partial<Transaction>): Promise<void> {
    const transactions = await this.getTransactions();
    const index = transactions.findIndex(tx => tx.id === id);
    if (index !== -1) {
      transactions[index] = { ...transactions[index], ...updates };
      await AsyncStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));
    }
  }

  static async deleteTransaction(id: string): Promise<void> {
    const transactions = await this.getTransactions();
    const filtered = transactions.filter(tx => tx.id !== id);
    await AsyncStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(filtered));
  }

  // Utility methods
  static generateId(prefix: string): string {
    return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  // Clear all data (for testing)
  static async clearAll(): Promise<void> {
    await AsyncStorage.multiRemove([
      STORAGE_KEYS.USERS,
      STORAGE_KEYS.SPACES,
      STORAGE_KEYS.CATEGORIES,
      STORAGE_KEYS.TRANSACTIONS,
      STORAGE_KEYS.INITIALIZED,
    ]);
  }
}

