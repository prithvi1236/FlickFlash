import { View, ScrollView } from 'react-native';
import { Text, Checkbox, Button, ActivityIndicator, Snackbar } from 'react-native-paper';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation, Theater } from '../components/LocationContext';
import { useRouter } from 'expo-router';

const BACKEND_URL = 'http://localhost:8000'; // Change to your backend URL

export default function TheaterSelectionScreen() {
  const { location, selectedMovie, selectedTheaters, setSelectedTheaters } = useLocation();
  const [theaters, setTheaters] = useState<Theater[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showError, setShowError] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!selectedMovie) return;
    setLoading(true);
    setError('');
    axios.get(`${BACKEND_URL}/theaters?location=${location}&movie_id=${selectedMovie.movie_id}`)
      .then(res => setTheaters(res.data.theaters))
      .catch(() => {
        setTheaters([]);
        setError('Failed to fetch theaters.');
        setShowError(true);
      })
      .finally(() => setLoading(false));
  }, [location, selectedMovie]);

  const allIds = theaters.map(t => t.theater_id);
  const allSelected = selectedTheaters.length === allIds.length && allIds.length > 0;

  const toggleTheater = (id: string) => {
    if (selectedTheaters.includes(id)) {
      setSelectedTheaters(selectedTheaters.filter(tid => tid !== id));
    } else {
      setSelectedTheaters([...selectedTheaters, id]);
    }
  };

  const toggleSelectAll = () => {
    if (allSelected) {
      setSelectedTheaters([]);
    } else {
      setSelectedTheaters(allIds);
    }
  };

  if (loading) return <ActivityIndicator style={{ marginTop: 40 }} />;

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Button mode="text" onPress={() => router.back()} style={{ marginBottom: 8 }}>Back</Button>
      <Text variant="titleLarge" style={{ marginBottom: 8 }}>Select Theaters</Text>
      <Button mode={allSelected ? 'contained' : 'outlined'} onPress={toggleSelectAll} style={{ marginBottom: 12 }}>
        {allSelected ? 'Unselect All' : 'Select All'}
      </Button>
      <ScrollView style={{ marginBottom: 16 }}>
        {theaters.map(theater => (
          <Checkbox.Item
            key={theater.theater_id}
            label={theater.name}
            status={selectedTheaters.includes(theater.theater_id) ? 'checked' : 'unchecked'}
            onPress={() => toggleTheater(theater.theater_id)}
          />
        ))}
        {theaters.length === 0 && <Text>No theaters found.</Text>}
      </ScrollView>
      <Button
        mode="contained"
        disabled={selectedTheaters.length === 0}
        onPress={() => router.push('/date-selection')}
      >
        Continue
      </Button>
      <Snackbar visible={showError} onDismiss={() => setShowError(false)}>{error}</Snackbar>
    </View>
  );
} 