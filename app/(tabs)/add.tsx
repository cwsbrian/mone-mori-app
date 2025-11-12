import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  Modal,
  FlatList,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '../_store/useAuthStore';
import { useSpaceStore } from '../_store/useSpaceStore';
import { useDataStore } from '../_store/useDataStore';
import { DataManager } from '../_utils/dataManager';
import { formatCalendarDate } from '../_utils/dateHelpers';
import { Category } from '../_types';

export default function AddTransactionScreen() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const { currentSpaceId, getCurrentSpace } = useSpaceStore();
  const { categories, addTransaction, loadCategories } = useDataStore();
  const currentSpace = getCurrentSpace();

  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [amount, setAmount] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [date, setDate] = useState(new Date());
  const [description, setDescription] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Cash');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);

  useEffect(() => {
    if (currentSpaceId) {
      loadCategories(currentSpaceId);
    }
  }, [currentSpaceId, loadCategories]);

  const filteredCategories = categories.filter((cat) => cat.type === type);

  const handleSave = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      Alert.alert('Error', 'Please enter a valid amount');
      return;
    }

    if (!selectedCategory) {
      Alert.alert('Error', 'Please select a category');
      return;
    }

    if (!currentSpaceId || !user) {
      Alert.alert('Error', 'No space or user selected');
      return;
    }

    const transaction = {
      id: DataManager.generateId('tx'),
      spaceId: currentSpaceId,
      userId: user.id,
      type,
      amount: parseFloat(amount),
      categoryId: selectedCategory.id,
      date: date.toISOString(),
      description: description.trim(),
      paymentMethod,
      receiptPhoto: null,
      createdAt: new Date().toISOString(),
    };

    await addTransaction(transaction);
    
    Alert.alert('Success', 'Transaction added successfully', [
      {
        text: 'OK',
        onPress: () => {
          // Reset form
          setAmount('');
          setDescription('');
          setSelectedCategory(null);
          setDate(new Date());
          router.back();
        },
      },
    ]);
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleCancel}>
          <Ionicons name="close" size={28} color="#1F2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add Transaction</Text>
        <TouchableOpacity onPress={handleSave}>
          <Text style={styles.saveButton}>Save</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {/* Type Toggle */}
        <View style={styles.typeToggle}>
          <TouchableOpacity
            style={[styles.typeButton, type === 'expense' && styles.typeButtonActive]}
            onPress={() => {
              setType('expense');
              setSelectedCategory(null);
            }}>
            <Text
              style={[
                styles.typeButtonText,
                type === 'expense' && styles.typeButtonTextActive,
              ]}>
              Expense
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.typeButton, type === 'income' && styles.typeButtonActive]}
            onPress={() => {
              setType('income');
              setSelectedCategory(null);
            }}>
            <Text
              style={[
                styles.typeButtonText,
                type === 'income' && styles.typeButtonTextActive,
              ]}>
              Income
            </Text>
          </TouchableOpacity>
        </View>

        {/* Amount Input */}
        <View style={styles.section}>
          <Text style={styles.label}>Amount *</Text>
          <View style={styles.amountContainer}>
            <Text style={styles.currencySymbol}>{currentSpace?.currency || 'CAD'}</Text>
            <TextInput
              style={styles.amountInput}
              placeholder="0.00"
              value={amount}
              onChangeText={setAmount}
              keyboardType="decimal-pad"
              placeholderTextColor="#9CA3AF"
            />
          </View>
        </View>

        {/* Category Selection */}
        <View style={styles.section}>
          <Text style={styles.label}>Category *</Text>
          <TouchableOpacity
            style={styles.categoryButton}
            onPress={() => setShowCategoryModal(true)}>
            {selectedCategory ? (
              <View style={styles.selectedCategory}>
                <Text style={styles.categoryIcon}>{selectedCategory.icon}</Text>
                <Text style={styles.categoryText}>{selectedCategory.name}</Text>
              </View>
            ) : (
              <Text style={styles.placeholderText}>Select a category</Text>
            )}
            <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
          </TouchableOpacity>
        </View>

        {/* Date */}
        <View style={styles.section}>
          <Text style={styles.label}>Date</Text>
          <View style={styles.dateContainer}>
            <Ionicons name="calendar-outline" size={20} color="#6B7280" />
            <Text style={styles.dateText}>{formatCalendarDate(date)}</Text>
          </View>
        </View>

        {/* Advanced Options Toggle */}
        <TouchableOpacity
          style={styles.advancedToggle}
          onPress={() => setShowAdvanced(!showAdvanced)}>
          <Text style={styles.advancedText}>Advanced Options</Text>
          <Ionicons
            name={showAdvanced ? 'chevron-up' : 'chevron-down'}
            size={20}
            color="#6B7280"
          />
        </TouchableOpacity>

        {/* Advanced Options */}
        {showAdvanced && (
          <>
            <View style={styles.section}>
              <Text style={styles.label}>Payment Method</Text>
              <TextInput
                style={styles.input}
                placeholder="Cash, Credit Card, etc."
                value={paymentMethod}
                onChangeText={setPaymentMethod}
              />
            </View>

            <View style={styles.section}>
              <Text style={styles.label}>Description</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Add a note..."
                value={description}
                onChangeText={setDescription}
                multiline
                numberOfLines={3}
              />
            </View>

            <View style={styles.section}>
              <Text style={styles.label}>Receipt Photo</Text>
              <TouchableOpacity
                style={styles.photoButton}
                onPress={() => Alert.alert('Coming Soon', 'Photo upload feature')}>
                <Ionicons name="camera-outline" size={24} color="#6B7280" />
                <Text style={styles.photoButtonText}>Add Photo</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </ScrollView>

      {/* Category Selection Modal */}
      <Modal
        visible={showCategoryModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowCategoryModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Category</Text>
              <TouchableOpacity onPress={() => setShowCategoryModal(false)}>
                <Ionicons name="close" size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>
            <FlatList
              data={filteredCategories}
              keyExtractor={(item) => item.id}
              numColumns={3}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.categoryItem}
                  onPress={() => {
                    setSelectedCategory(item);
                    setShowCategoryModal(false);
                  }}>
                  <View
                    style={[
                      styles.categoryIconContainer,
                      { backgroundColor: item.color + '20' },
                    ]}>
                    <Text style={styles.categoryItemIcon}>{item.icon}</Text>
                  </View>
                  <Text style={styles.categoryItemText} numberOfLines={1}>
                    {item.name}
                  </Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
  },
  saveButton: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4F46E5',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  typeToggle: {
    flexDirection: 'row',
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    padding: 4,
    marginBottom: 24,
  },
  typeButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  typeButtonActive: {
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  typeButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
  },
  typeButtonTextActive: {
    color: '#1F2937',
  },
  section: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  amountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#4F46E5',
    borderRadius: 12,
    padding: 16,
  },
  currencySymbol: {
    fontSize: 24,
    fontWeight: '700',
    color: '#4F46E5',
    marginRight: 8,
  },
  amountInput: {
    flex: 1,
    fontSize: 32,
    fontWeight: '700',
    color: '#1F2937',
  },
  categoryButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    padding: 16,
  },
  selectedCategory: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  categoryText: {
    fontSize: 16,
    color: '#1F2937',
    fontWeight: '500',
  },
  placeholderText: {
    fontSize: 16,
    color: '#9CA3AF',
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    padding: 16,
  },
  dateText: {
    fontSize: 16,
    color: '#1F2937',
    marginLeft: 12,
  },
  advancedToggle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    marginBottom: 12,
  },
  advancedText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4F46E5',
  },
  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    color: '#1F2937',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  photoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#D1D5DB',
    borderStyle: 'dashed',
    borderRadius: 12,
    padding: 24,
  },
  photoButtonText: {
    fontSize: 16,
    color: '#6B7280',
    marginLeft: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
  },
  categoryItem: {
    flex: 1,
    alignItems: 'center',
    padding: 12,
    margin: 8,
  },
  categoryIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  categoryItemIcon: {
    fontSize: 32,
  },
  categoryItemText: {
    fontSize: 12,
    color: '#1F2937',
    textAlign: 'center',
  },
});

