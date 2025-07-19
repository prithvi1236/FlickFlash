import { View, ScrollView } from 'react-native';
import { Text, Card, Button, Chip, Snackbar } from 'react-native-paper';
import React, { useState } from 'react';

// Mock data for demonstration
const MOCK_REQUESTS = [
  {
    request_id: '1',
    movie_title: 'Inception',
    show_date: '2025-07-21',
    theaters: ['PVR', 'INOX'],
    location: 'Mumbai',
    status: 'ACTIVE',
  },
  {
    request_id: '2',
    movie_title: 'Interstellar',
    show_date: '2025-07-25',
    theaters: ['Cinepolis'],
    location: 'Delhi',
    status: 'EXPIRED',
  },
];

export default function RequestHistoryScreen() {
  const [requests, setRequests] = useState(MOCK_REQUESTS);
  const [showCancel, setShowCancel] = useState(false);

  const cancelRequest = (id: string) => {
    setRequests(reqs => reqs.map(r => r.request_id === id ? { ...r, status: 'CANCELLED' } : r));
    setShowCancel(true);
  };

  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      <Text variant="titleLarge" style={{ marginBottom: 16 }}>Request History</Text>
      {requests.length === 0 && <Text>No requests found.</Text>}
      {requests.map(req => (
        <Card key={req.request_id} style={{ marginBottom: 16 }}>
          <Card.Title title={req.movie_title} subtitle={`Date: ${req.show_date}`} />
          <Card.Content>
            <Text>Theaters: {req.theaters.join(', ')}</Text>
            <Text>Location: {req.location}</Text>
            <Chip style={{ marginTop: 8 }}>
              {req.status}
            </Chip>
          </Card.Content>
          {req.status === 'ACTIVE' && (
            <Card.Actions>
              <Button onPress={() => cancelRequest(req.request_id)}>Cancel</Button>
            </Card.Actions>
          )}
        </Card>
      ))}
      <Snackbar visible={showCancel} onDismiss={() => setShowCancel(false)} duration={1500}>
        Request cancelled.
      </Snackbar>
    </ScrollView>
  );
} 