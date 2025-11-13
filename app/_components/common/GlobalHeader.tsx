import React from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import { CurrentSpaceSelector } from './CurrentSpaceSelector';
import { NotificationIcon } from './NotificationIcon';

export function GlobalHeader() {
  const handleNotificationPress = () => {
    Alert.alert('Notifications', 'No new notifications');
  };

  return (
    <View style={styles.container}>
      <CurrentSpaceSelector />
      <NotificationIcon onPress={handleNotificationPress} badgeCount={0} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
});

