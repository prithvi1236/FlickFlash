import { View, FlatList, Image } from 'react-native';
import { Text, Searchbar, Card, ActivityIndicator, Snackbar, Button } from 'react-native-paper';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation, Movie } from '../components/LocationContext';
import { useRouter } from 'expo-router';

const BACKEND_URL = 'http://localhost:8000'; // Change to your backend URL

export default function MovieSelectionScreen() {
  const { location, setSelectedMovie } = useLocation();
  const [movies, setMovies] = useState<Movie[]>([]);
  const [filtered, setFiltered] = useState<Movie[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showError, setShowError] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setLoading(true);
    setError('');
    axios.get(`${BACKEND_URL}/movies?location=${location}`)
      .then(res => {
        setMovies(res.data.movies);
        setFiltered(res.data.movies);
      })
      .catch(() => {
        setMovies([]);
        setError('Failed to fetch movies.');
        setShowError(true);
      })
      .finally(() => setLoading(false));
  }, [location]);

  useEffect(() => {
    setFiltered(
      movies.filter(m => m.title.toLowerCase().includes(search.toLowerCase()))
    );
  }, [search, movies]);

  if (loading) {
    return <ActivityIndicator style={{ marginTop: 40 }} />;
  }

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Button mode="text" onPress={() => router.back()} style={{ marginBottom: 8 }}>Back</Button>
      <Text variant="titleLarge" style={{ marginBottom: 8 }}>Select a Movie</Text>
      <Searchbar
        placeholder="Search movies"
        value={search}
        onChangeText={setSearch}
        style={{ marginBottom: 16 }}
      />
      <FlatList
        data={filtered}
        keyExtractor={item => item.movie_id}
        renderItem={({ item }) => (
          <Card
            style={{ marginBottom: 12 }}
            onPress={() => {
              setSelectedMovie(item);
              router.push('/theater-selection');
            }}
          >
            <Card.Title title={item.title} subtitle={item.release_date} />
            <Card.Content>
              <Image source={{ uri: item.poster_url }} style={{ width: '100%', height: 200, resizeMode: 'cover', borderRadius: 8 }} />
            </Card.Content>
          </Card>
        )}
        ListEmptyComponent={<Text>No movies found.</Text>}
      />
      <Snackbar visible={showError} onDismiss={() => setShowError(false)}>{error}</Snackbar>
    </View>
  );
} 