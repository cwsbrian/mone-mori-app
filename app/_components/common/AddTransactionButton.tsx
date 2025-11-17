import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useRef, useState } from 'react';
import {
    Animated,
    Dimensions,
    Modal,
    Platform,
    StyleSheet,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AddTransactionForm } from '../transactions/AddTransactionForm';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export function AddTransactionButton() {
  const [isOpen, setIsOpen] = useState(false);
  const insets = useSafeAreaInsets();
  const slideAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const backdropOpacity = useRef(new Animated.Value(0)).current;

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
          toValue: SCREEN_HEIGHT,
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

  const handleOpen = () => {
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleSave = () => {
    handleClose();
  };

  const handleCancel = () => {
    handleClose();
  };

  const bottomOffset = insets.bottom;

  return (
    <>
      <TouchableOpacity
        style={[
          styles.fab,
          {
            bottom: bottomOffset,
            right: 20,
          },
        ]}
        onPress={handleOpen}
        activeOpacity={0.8}>
        <Ionicons name="add" size={28} color="#fff" />
      </TouchableOpacity>

      <Modal
        visible={isOpen}
        transparent
        animationType="none"
        onRequestClose={handleClose}
        statusBarTranslucent>
        <View style={styles.container}>
          <TouchableWithoutFeedback onPress={handleClose}>
            <Animated.View
              style={[
                styles.backdrop,
                {
                  opacity: backdropOpacity,
                },
              ]}
            />
          </TouchableWithoutFeedback>
          <Animated.View
            style={[
              styles.drawer,
              {
                transform: [{ translateY: slideAnim }],
              },
            ]}>
            <View style={styles.handle} />
            <View style={styles.content}>
              <AddTransactionForm onSave={handleSave} onCancel={handleCancel} />
            </View>
          </Animated.View>
        </View>
      </Modal>
    </>
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
  container: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  drawer: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '90%',
    height: '90%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 10,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: '#D1D5DB',
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 12,
    marginBottom: 8,
  },
  content: {
    flex: 1,
  },
});

