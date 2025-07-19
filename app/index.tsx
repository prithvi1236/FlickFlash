import { View } from 'react-native';
import { Button, Text, Menu, Divider } from 'react-native-paper';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { useLocation, Location } from '../components/LocationContext';

const LOCATIONS: Location[] = ['Mumbai', 'Delhi', 'Kochi'];

export default function HomeScreen() {
  const router = useRouter();
  const { location, setLocation } = useLocation();
  const [menuVisible, setMenuVisible] = useState(false);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 }}>
      <Text variant="headlineMedium" style={{ marginBottom: 16 }}>Movie Show Alert</Text>
      {/* Location selection dropdown */}
      <Menu
        visible={menuVisible}
        onDismiss={() => setMenuVisible(false)}
        anchor={
          <Button mode="outlined" onPress={() => setMenuVisible(true)} style={{ marginBottom: 8 }}>
            {location}
          </Button>
        }
      >
        {LOCATIONS.map(loc => (
          <Menu.Item
            key={loc}
            onPress={() => {
              setLocation(loc);
              setMenuVisible(false);
            }}
            title={loc}
          />
        ))}
      </Menu>
      <Text style={{ marginBottom: 24 }}>Selected Location: {location}</Text>
      {/* Button to start a new notification request */}
      <Button
        mode="contained"
        onPress={() => router.push('/movie-selection')}
        style={{ marginBottom: 16 }}
      >
        New Notification Request
      </Button>
      {/* Button to view request history */}
      <Button
        mode="outlined"
        onPress={() => router.push('/request-history')}
      >
        View Request History
      </Button>
    </View>
  );
} 