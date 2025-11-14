import React from 'react';
import { TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface FloatingActionButtonProps {
  onPress: () => void;
}

export function FloatingActionButton({ onPress }: FloatingActionButtonProps) {
  const insets = useSafeAreaInsets();
  // Tab bar height (88) + padding bottom (28) + safe area bottom
  const bottomOffset = insets.bottom + 116;

  return (
    <TouchableOpacity
      style={[
        styles.fab,
        {
          bottom: bottomOffset,
          right: 20,
        },
      ]}
      onPress={onPress}
      activeOpacity={0.8}>
      <Ionicons name="add" size={28} color="#fff" />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#4F46E5',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    zIndex: 9999,
    ...Platform.select({
      ios: {
        shadowOpacity: 0.3,
      },
      android: {
        elevation: 8,
      },
    }),
  },
});

