import { View, ScrollView } from 'react-native';
import { Text, Button, Snackbar, Card } from 'react-native-paper';
import React, { useState } from 'react';
import { useLocation } from '../components/LocationContext';
import { useRouter } from 'expo-router';

export default function ConfirmationScreen() {
  const {
    location,
    selectedMovie,
    selectedTheaters,
    setSelectedMovie,
    setSelectedTheaters,
    selectedDate,
    setSelectedDate,
  } = useLocation();
  const [showSuccess, setShowSuccess] = useState(false);
  const router = useRouter();

  // Mock theater names for summary (in real app, fetch names by ID)
  const theaterNames = selectedTheaters.map((id, idx) => `Theater ${idx + 1}`).join(', ');

  const handleSubmit = () => {
    setShowSuccess(true);
    // Reset context for new request
    setSelectedMovie(null);
    setSelectedTheaters([]);
    setSelectedDate(null);
    setTimeout(() => {
      setShowSuccess(false);
      router.replace('/');
    }, 1500);
  };

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center', padding: 24 }}>
      <Button mode="text" onPress={() => router.back()} style={{ marginBottom: 8 }}>Back</Button>
      <Text variant="titleLarge" style={{ marginBottom: 16 }}>Confirm Your Request</Text>
      {selectedMovie && (
        <Card style={{ width: '100%', marginBottom: 16 }}>
          <Card.Title title={selectedMovie.title} subtitle={selectedMovie.release_date} />
          <Card.Content>
            <Text>Location: {location}</Text>
            <Text>Date: {selectedDate}</Text>
            <Text>Theaters: {theaterNames}</Text>
          </Card.Content>
        </Card>
      )}
      <Button
        mode="contained"
        onPress={handleSubmit}
        disabled={!selectedMovie || !selectedDate || selectedTheaters.length === 0}
      >
        Submit Request
      </Button>
      <Snackbar
        visible={showSuccess}
        onDismiss={() => setShowSuccess(false)}
        duration={1500}
      >
        Request submitted!
      </Snackbar>
    </ScrollView>
  );
} 