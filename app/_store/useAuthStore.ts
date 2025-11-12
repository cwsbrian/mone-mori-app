import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '../_types';
import { DataManager } from '../_utils/dataManager';

interface AuthState {
  isLoggedIn: boolean;
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, nickname: string) => Promise<boolean>;
  logout: () => void;
  updateUser: (updates: Partial<User>) => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      isLoggedIn: false,
      user: null,
      token: null,

      login: async (email: string, password: string) => {
        try {
          const user = await DataManager.getUserByEmail(email);
          
          if (user && user.password === password) {
            // Mock JWT token
            const token = `mock-jwt-token-${user.id}-${Date.now()}`;
            
            set({
              isLoggedIn: true,
              user,
              token,
            });
            
            return true;
          }
          
          return false;
        } catch (error) {
          console.error('Login error:', error);
          return false;
        }
      },

      register: async (email: string, password: string, nickname: string) => {
        try {
          // Check if user already exists
          const existingUser = await DataManager.getUserByEmail(email);
          if (existingUser) {
            return false;
          }

          // Create new user
          const newUser: User = {
            id: DataManager.generateId('user'),
            email,
            password,
            nickname,
            isPremium: false,
            createdAt: new Date().toISOString(),
          };

          await DataManager.addUser(newUser);

          // Create default "Personal Account Book" space
          const defaultSpace = {
            id: DataManager.generateId('space'),
            name: 'Personal Account Book',
            emoji: '💰',
            currency: 'CAD',
            memberIds: [newUser.id],
            createdBy: newUser.id,
            createdAt: new Date().toISOString(),
          };

          await DataManager.addSpace(defaultSpace);

          // Auto-login after registration
          const token = `mock-jwt-token-${newUser.id}-${Date.now()}`;
          
          set({
            isLoggedIn: true,
            user: newUser,
            token,
          });

          return true;
        } catch (error) {
          console.error('Registration error:', error);
          return false;
        }
      },

      logout: () => {
        set({
          isLoggedIn: false,
          user: null,
          token: null,
        });
      },

      updateUser: async (updates: Partial<User>) => {
        const { user } = get();
        if (!user) return;

        await DataManager.updateUser(user.id, updates);
        
        set({
          user: { ...user, ...updates },
        });
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

