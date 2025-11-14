import React, { useEffect, useRef } from 'react';
import {
  Modal,
  View,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
  TouchableWithoutFeedback,
} from 'react-native';
import { AddTransactionForm } from '../transactions/AddTransactionForm';

interface AddTransactionDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export function AddTransactionDrawer({ isOpen, onClose }: AddTransactionDrawerProps) {
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

  const handleSave = () => {
    onClose();
  };

  const handleCancel = () => {
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
  );
}

const styles = StyleSheet.create({
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

