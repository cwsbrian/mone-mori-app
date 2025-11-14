import React, { useEffect, useRef, useState } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
  TouchableWithoutFeedback,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSpaceStore } from '../../_store/useSpaceStore';
import { useDataStore } from '../../_store/useDataStore';

interface AccountDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const DRAWER_WIDTH = SCREEN_WIDTH * 0.85;

export function AccountDrawer({ isOpen, onClose }: AccountDrawerProps) {
  const slideAnim = useRef(new Animated.Value(DRAWER_WIDTH)).current;
  const backdropOpacity = useRef(new Animated.Value(0)).current;
  const { spaces, currentSpaceId, setCurrentSpace, getCurrentSpace } = useSpaceStore();
  const { loadTransactions, loadCategories } = useDataStore();
  const currentSpace = getCurrentSpace();

  useEffect(() => {
    if (isOpen) {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(backdropOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: DRAWER_WIDTH,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(backdropOpacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [isOpen, slideAnim, backdropOpacity]);

  const handleSpaceSelect = async (spaceId: string) => {
    setCurrentSpace(spaceId);
    await loadTransactions(spaceId);
    await loadCategories(spaceId);
    onClose();
  };

  return (
    <Modal
      visible={isOpen}
      transparent
      animationType="none"
      onRequestClose={onClose}
      statusBarTranslucent>
      <View style={styles.container}>
        <TouchableWithoutFeedback onPress={onClose}>
          <Animated.View
            style={[
              styles.backdrop,
              {
                opacity: backdropOpacity,
              },
            ]}
          />
        </TouchableWithoutFeedback>
        <TouchableWithoutFeedback>
          <Animated.View
            style={[
              styles.drawer,
              {
                transform: [{ translateX: slideAnim }],
              },
            ]}>
            <View style={styles.header}>
              <Text style={styles.headerTitle}>Account Selection</Text>
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <Ionicons name="close" size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>

            <View style={styles.content}>
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
          </Animated.View>
        </TouchableWithoutFeedback>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  drawer: {
    width: DRAWER_WIDTH,
    height: '100%',
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: -2, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
  },
  closeButton: {
    padding: 4,
  },
  content: {
    flex: 1,
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

