import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSpaceStore } from '../../_store/useSpaceStore';
import { useDataStore } from '../../_store/useDataStore';

export function CurrentSpaceSelector() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { spaces, currentSpaceId, setCurrentSpace, getCurrentSpace } = useSpaceStore();
  const { loadTransactions, loadCategories } = useDataStore();
  const currentSpace = getCurrentSpace();

  const handleSpaceSelect = async (spaceId: string) => {
    setCurrentSpace(spaceId);
    setIsModalVisible(false);
    
    // Reload data for the new space
    await loadTransactions(spaceId);
    await loadCategories(spaceId);
  };

  return (
    <>
      <TouchableOpacity
        style={styles.container}
        onPress={() => setIsModalVisible(true)}>
        <Text style={styles.emoji}>{currentSpace?.emoji || '💰'}</Text>
        <Text style={styles.name} numberOfLines={1}>
          {currentSpace?.name || 'Select Space'}
        </Text>
        <Ionicons name="chevron-down" size={16} color="#6B7280" />
      </TouchableOpacity>

      <Modal
        visible={isModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setIsModalVisible(false)}>
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setIsModalVisible(false)}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Space</Text>
              <TouchableOpacity onPress={() => setIsModalVisible(false)}>
                <Ionicons name="close" size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>

            <FlatList
              data={spaces}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.spaceItem,
                    item.id === currentSpaceId && styles.spaceItemActive,
                  ]}
                  onPress={() => handleSpaceSelect(item.id)}>
                  <Text style={styles.spaceEmoji}>{item.emoji}</Text>
                  <View style={styles.spaceInfo}>
                    <Text style={styles.spaceName}>{item.name}</Text>
                    <Text style={styles.spaceCurrency}>{item.currency}</Text>
                  </View>
                  {item.id === currentSpaceId && (
                    <Ionicons name="checkmark" size={24} color="#4F46E5" />
                  )}
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    maxWidth: 200,
  },
  emoji: {
    fontSize: 20,
    marginRight: 8,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    flex: 1,
    marginRight: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 16,
    width: '85%',
    maxHeight: '70%',
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
  },
  spaceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  spaceItemActive: {
    backgroundColor: '#EEF2FF',
  },
  spaceEmoji: {
    fontSize: 32,
    marginRight: 12,
  },
  spaceInfo: {
    flex: 1,
  },
  spaceName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 2,
  },
  spaceCurrency: {
    fontSize: 14,
    color: '#6B7280',
  },
});

