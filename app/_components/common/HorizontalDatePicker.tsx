import React, { useEffect, useRef, useState } from 'react';
import { Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { formatCalendarDate, isSameMonth, isToday } from '../../_utils/dateHelpers';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const DATE_ITEM_WIDTH = 70;
const DATE_ITEM_SPACING = 8;
const TOTAL_ITEM_WIDTH = DATE_ITEM_WIDTH + DATE_ITEM_SPACING;

interface HorizontalDatePickerProps {
  selectedDate: string;
  onDateSelect: (date: string) => void;
  markedDates?: { [key: string]: { marked?: boolean } };
}

export function HorizontalDatePicker({
  selectedDate,
  onDateSelect,
  markedDates = {},
}: HorizontalDatePickerProps) {
  const scrollViewRef = useRef<ScrollView>(null);
  const [dates, setDates] = useState<Date[]>([]);
  const [viewingMonth, setViewingMonth] = useState<number>(new Date().getMonth());
  const [viewingYear, setViewingYear] = useState<number>(new Date().getFullYear());
  const [todayIndex, setTodayIndex] = useState<number>(0);
  const isLoadingMoreRef = useRef<boolean>(false);

  useEffect(() => {
    const today = new Date();
    const dateList: Date[] = [];
    
    // Generate initial range: 30 days before, today, 30 days after (total 61 days)
    // This gives enough range for scrolling
    for (let i = -30; i <= 30; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dateList.push(date);
    }
    
    setDates(dateList);
    setTodayIndex(30); // Today is at index 30
    setViewingMonth(today.getMonth());
    setViewingYear(today.getFullYear());
    
    // Auto-scroll to today (index 30)
    // Account for paddingHorizontal in scroll calculation
    const paddingHorizontal = (SCREEN_WIDTH - DATE_ITEM_WIDTH) / 2;
    setTimeout(() => {
      scrollViewRef.current?.scrollTo({
        x: TOTAL_ITEM_WIDTH * 30 - paddingHorizontal,
        animated: false,
      });
    }, 100);
  }, []);

  const handleScroll = (event: any) => {
    const scrollX = event.nativeEvent.contentOffset.x;
    const contentWidth = event.nativeEvent.contentSize.width;
    const layoutWidth = event.nativeEvent.layoutMeasurement.width;
    const paddingHorizontal = (SCREEN_WIDTH - DATE_ITEM_WIDTH) / 2;
    // Account for padding when calculating center index
    const centerIndex = Math.round((scrollX + paddingHorizontal) / TOTAL_ITEM_WIDTH);
    
    // Update viewing month
    if (centerIndex >= 0 && centerIndex < dates.length) {
      const centerDate = dates[centerIndex];
      const newMonth = centerDate.getMonth();
      const newYear = centerDate.getFullYear();
      
      if (newMonth !== viewingMonth || newYear !== viewingYear) {
        setViewingMonth(newMonth);
        setViewingYear(newYear);
      }
    }
    
    // Load more dates when scrolling near the edges
    if (contentWidth > 0 && layoutWidth > 0 && !isLoadingMoreRef.current) {
      const maxScroll = contentWidth - layoutWidth;
      const scrollPercentage = maxScroll > 0 ? scrollX / maxScroll : 0;
      
      // If scrolled more than 85% to the right, add more dates to the end
      if (scrollPercentage > 0.85 && dates.length > 0) {
        isLoadingMoreRef.current = true;
        const lastDate = new Date(dates[dates.length - 1]);
        const newDates: Date[] = [];
        
        // Add 30 more days to the end
        for (let i = 1; i <= 30; i++) {
          const date = new Date(lastDate);
          date.setDate(lastDate.getDate() + i);
          newDates.push(date);
        }
        
        if (newDates.length > 0) {
          setDates(prev => {
            isLoadingMoreRef.current = false;
            return [...prev, ...newDates];
          });
        } else {
          isLoadingMoreRef.current = false;
        }
      }
      
      // If scrolled less than 15% from the left, add more dates to the beginning
      if (scrollPercentage < 0.15 && dates.length > 0) {
        isLoadingMoreRef.current = true;
        const firstDate = new Date(dates[0]);
        const newDates: Date[] = [];
        
        // Add 30 more days to the beginning
        for (let i = 30; i >= 1; i--) {
          const date = new Date(firstDate);
          date.setDate(firstDate.getDate() - i);
          newDates.push(date);
        }
        
        if (newDates.length > 0) {
          const currentScrollX = scrollX;
          const addedWidth = newDates.length * TOTAL_ITEM_WIDTH;
          
          setDates(prev => {
            isLoadingMoreRef.current = false;
            return [...newDates, ...prev];
          });
          setTodayIndex(prev => prev + newDates.length);
          
          // Adjust scroll position to account for added dates
          setTimeout(() => {
            scrollViewRef.current?.scrollTo({
              x: currentScrollX + addedWidth,
              animated: false,
            });
          }, 0);
        } else {
          isLoadingMoreRef.current = false;
        }
      }
    }
  };

  const formatDayOfWeek = (date: Date): string => {
    return date.toLocaleDateString('en-US', { weekday: 'short' });
  };

  const formatMonth = (date: Date): string => {
    return date.toLocaleDateString('en-US', { month: 'short' });
  };

  const shouldShowMonth = (date: Date): boolean => {
    // Show month if the date's month is different from today's month
    // Current month dates don't show month, other months always show month
    const today = new Date();
    return !isSameMonth(date, today);
  };

  const scrollToToday = () => {
    const today = new Date();
    const todayString = formatCalendarDate(today);
    
    // Find today's index in dates array
    const todayIndexInDates = dates.findIndex(date => {
      const dateString = formatCalendarDate(date);
      return dateString === todayString;
    });
    
    if (todayIndexInDates >= 0) {
      const paddingHorizontal = (SCREEN_WIDTH - DATE_ITEM_WIDTH) / 2;
      scrollViewRef.current?.scrollTo({
        x: TOTAL_ITEM_WIDTH * todayIndexInDates - paddingHorizontal,
        animated: true,
      });
      
      // Select today's date
      onDateSelect(todayString);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.todayButton}
        onPress={scrollToToday}>
        <Text style={styles.todayButtonText}>Today</Text>
      </TouchableOpacity>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        decelerationRate="fast"
        style={styles.scrollView}
        bounces={false}>
        {dates.map((date, index) => {
          const dateString = formatCalendarDate(date);
          const isSelected = dateString === selectedDate;
          const hasTransactions = markedDates[dateString]?.marked || false;
          const showMonth = shouldShowMonth(date);
          const dateIsToday = isToday(date);

          return (
            <TouchableOpacity
              key={dateString}
              style={[
                styles.dateItem,
                isSelected && styles.dateItemSelected,
              ]}
              onPress={() => onDateSelect(dateString)}>
              {showMonth && (
                <Text style={[
                  styles.monthText,
                  isSelected && styles.monthTextSelected,
                ]}>
                  {formatMonth(date)}
                </Text>
              )}
              <Text style={[
                styles.dayOfWeek,
                isSelected && styles.dayOfWeekSelected,
                !isSelected && dateIsToday && styles.dayOfWeekToday,
              ]}>
                {formatDayOfWeek(date)}
              </Text>
              <Text style={[
                styles.dateNumber,
                isSelected && styles.dateNumberSelected,
                !isSelected && dateIsToday && styles.dateNumberToday,
              ]}>
                {date.getDate()}
              </Text>
              {hasTransactions && (
                <View style={[
                  styles.transactionDot,
                  isSelected && styles.transactionDotSelected,
                ]} />
              )}
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    paddingVertical: 16,
    width: '100%',
    position: 'relative',
  },
  todayButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 10,
    backgroundColor: '#4F46E5',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  todayButtonText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
  },
  scrollView: {
    width: '100%',
  },
  scrollContent: {
    paddingLeft: (SCREEN_WIDTH - DATE_ITEM_WIDTH) / 2,
    paddingRight: (SCREEN_WIDTH - DATE_ITEM_WIDTH) / 2,
    gap: DATE_ITEM_SPACING,
    alignItems: 'center',
  },
  dateItem: {
    width: DATE_ITEM_WIDTH,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 12,
    backgroundColor: 'transparent',
  },
  dateItemSelected: {
    backgroundColor: '#4F46E5',
  },
  monthText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  monthTextSelected: {
    color: '#ffffff',
  },
  dayOfWeek: {
    fontSize: 12,
    fontWeight: '500',
    color: '#6B7280',
    marginBottom: 4,
  },
  dayOfWeekSelected: {
    color: '#ffffff',
  },
  dayOfWeekToday: {
    color: '#4F46E5',
  },
  dateNumber: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
  },
  dateNumberSelected: {
    color: '#ffffff',
  },
  dateNumberToday: {
    color: '#4F46E5',
  },
  transactionDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#4F46E5',
    marginTop: 4,
  },
  transactionDotSelected: {
    backgroundColor: '#ffffff',
  },
});

