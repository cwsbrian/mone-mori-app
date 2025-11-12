export interface User {
  id: string;
  email: string;
  password: string;
  nickname: string;
  isPremium: boolean;
  createdAt: string;
}

export interface Space {
  id: string;
  name: string;
  emoji: string;
  currency: string;
  memberIds: string[];
  createdBy: string;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  type: 'income' | 'expense';
  isDefault: boolean;
  spaceId: string | null;
}

export interface Transaction {
  id: string;
  spaceId: string;
  userId: string;
  type: 'income' | 'expense';
  amount: number;
  categoryId: string;
  date: string;
  description: string;
  paymentMethod: string;
  receiptPhoto: string | null;
  createdAt: string;
}

export interface TransactionWithDetails extends Transaction {
  category?: Category;
  user?: User;
}

