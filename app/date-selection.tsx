import { View } from 'react-native';
import { Text, Button } from 'react-native-paper';
import React, { useState } from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useLocation } from '../components/LocationContext';
import { useRouter } from 'expo-router';

const MIN_DATE = new Date('2025-07-19');
const MAX_DATE = new Date('2025-08-19');

export default function DateSelectionScreen() {
  const { selectedDate, setSelectedDate } = useLocation();
  const [showPicker, setShowPicker] = useState(false);
  const router = useRouter();

  const date = selectedDate ? new Date(selectedDate) : MIN_DATE;

  const onChange = (_: any, selected?: Date) => {
    setShowPicker(false);
    if (selected) {
      setSelectedDate(selected.toISOString().split('T')[0]);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 }}>
      <Button mode="text" onPress={() => router.back()} style={{ marginBottom: 8 }}>Back</Button>
      <Text variant="titleLarge" style={{ marginBottom: 16 }}>Select Show Date</Text>
      <Button mode="outlined" onPress={() => setShowPicker(true)} style={{ marginBottom: 16 }}>
        {selectedDate ? selectedDate : 'Pick a date'}
      </Button>
      {showPicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display="default"
          minimumDate={MIN_DATE}
          maximumDate={MAX_DATE}
          onChange={onChange}
        />
      )}
      <Button
        mode="contained"
        disabled={!selectedDate}
        onPress={() => router.push('/confirmation')}
      >
        Continue
      </Button>
    </View>
  );
} 