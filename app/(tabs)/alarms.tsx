import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { EmptyState } from '../_components/home/EmptyState';

export default function AlarmsScreen() {
  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <EmptyState
          title="No Notifications"
          message="You'll see notifications here when you have new updates"
          icon="notifications-outline"
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  scrollView: {
    flex: 1,
  },
});

