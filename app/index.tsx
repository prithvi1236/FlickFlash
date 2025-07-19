import { View, StyleSheet, Dimensions, TouchableOpacity, Modal } from 'react-native';
import { Text } from 'react-native-paper';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { useLocation, Location } from '../components/LocationContext';
import { useAuth } from '../components/AuthContext';

const { width, height } = Dimensions.get('window');

export default function HomeScreen() {
  const router = useRouter();
  const { location, setLocation } = useLocation();
  const { user, signOut } = useAuth();
  const [hoveredButton, setHoveredButton] = useState<string | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleButtonPress = (route: '/movie-selection' | '/request-history') => {
    router.push(route);
  };

  const handleButtonHover = (buttonId: string) => {
    setHoveredButton(buttonId);
  };

  const handleButtonLeave = () => {
    setHoveredButton(null);
  };

  const handleLocationSelect = (selectedLocation: Location) => {
    setLocation(selectedLocation);
    setDropdownOpen(false);
  };

  return (
    <View style={styles.container}>
        {/* Main Content Panel */}
        <View style={styles.mainPanel}>
          <View style={styles.contentArea}>
            {/* Main Title */}
            <Text style={styles.mainTitle}>
              Flash Flicker
            </Text>

          {/* Location Dropdown */}
          <View style={styles.dropdownContainer}>
            <TouchableOpacity
              style={styles.dropdownButton}
              onPress={() => {
                setDropdownOpen(true);
              }}
            >
              <Text style={styles.dropdownText}>
                {location || 'Select Location'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Action Buttons */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[
                styles.actionButton,
                hoveredButton === 'create' && styles.actionButtonHovered
              ]}
              onPress={() => handleButtonPress('/movie-selection')}
              onPressIn={() => handleButtonHover('create')}
              onPressOut={handleButtonLeave}
              activeOpacity={0.8}
            >
              <Text style={[
                styles.buttonLabel,
                hoveredButton === 'create' && styles.buttonLabelHovered
              ]}>
                Create a New Notification
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.actionButton,
                hoveredButton === 'history' && styles.actionButtonHovered
              ]}
              onPress={() => handleButtonPress('/request-history')}
              onPressIn={() => handleButtonHover('history')}
              onPressOut={handleButtonLeave}
              activeOpacity={0.8}
            >
              <Text style={[
                styles.buttonLabel,
                hoveredButton === 'history' && styles.buttonLabelHovered
              ]}>
                View Request History
              </Text>
            </TouchableOpacity>

            {/* Sign Out Button */}
            <TouchableOpacity
              style={[
                styles.actionButton,
                styles.signOutButton
              ]}
              onPress={signOut}
              activeOpacity={0.8}
            >
              <Text style={styles.signOutButtonText}>
                Sign Out
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Modal for dropdown options */}
      <Modal
        visible={dropdownOpen}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setDropdownOpen(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Location:</Text>
            
            <TouchableOpacity
              style={styles.modalItem}
              onPress={() => {
                handleLocationSelect('Delhi');
              }}
            >
              <Text style={styles.modalItemText}>Delhi</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.modalItem}
              onPress={() => {
                handleLocationSelect('Kochi');
              }}
            >
              <Text style={styles.modalItemText}>Kochi</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.modalItem}
              onPress={() => {
                handleLocationSelect('Mumbai');
              }}
            >
              <Text style={styles.modalItemText}>Mumbai</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setDropdownOpen(false)}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#374151', // gray-800 equivalent
    minHeight: '100%',
  },
  mainPanel: {
    height: '100%',
  },
  contentArea: {
    backgroundColor: '#48A6A7', // Exact color from your code
    height: '100%',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 80,
  },
  mainTitle: {
    color: '#F2EFE7', // Exact color from your code
    fontSize: 72, // text-7xl equivalent
    fontWeight: '400', // Preahvihear weight
    letterSpacing: 2, // tracking-wide
    textAlign: 'center',
    marginBottom: 64, // space-y-16 equivalent
    fontFamily: 'Preahvihear', // Custom Preahvihear font
  },
  buttonContainer: {
    flexDirection: 'column',
    gap: 32, // gap-8 equivalent
    width: '100%',
    maxWidth: 896, // max-w-4xl equivalent
  },
  actionButton: {
    borderWidth: 2,
    borderColor: '#F2EFE7', // Exact color from your code
    backgroundColor: 'transparent',
    borderRadius: 50, // rounded-full
    height: 64, // h-16
    marginBottom: 16,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  actionButtonHovered: {
    backgroundColor: '#F2EFE7', // Fill with cream color on hover
    borderColor: '#F2EFE7',
  },
  buttonLabel: {
    color: '#F2EFE7', // Exact color from your code
    fontSize: 18, // text-lg
    fontWeight: '400', // Poppins weight
    textAlign: 'center',
    fontFamily: 'Poppins-Regular', // Custom Poppins font
  },
  buttonLabelHovered: {
    color: '#48A6A7', // Text changes to teal color on hover
  },
  dropdownContainer: {
    width: '100%',
    maxWidth: 448,
    marginBottom: 48,
    alignItems: 'center',
  },
  dropdownButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#F2EFE7',
    borderRadius: 50, // rounded-full like action buttons
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
    height: 56, // h-14 equivalent
    minWidth: 200,
  },
  dropdownText: {
    color: '#F2EFE7', // Same color as action buttons
    fontSize: 18, // text-lg
    fontWeight: '400', // Poppins weight
    textAlign: 'center',
    fontFamily: 'Poppins-Regular', // Same font as action buttons
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#48A6A7', // Same as main page background
    borderRadius: 12,
    padding: 20,
    margin: 40,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#F2EFE7', // Cream border like main page elements
    minWidth: 250,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '500',
    color: '#F2EFE7', // Cream text like main page
    marginBottom: 16,
    textAlign: 'center',
    fontFamily: 'Poppins-Medium',
  },
  modalItem: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#F2EFE7', // Cream border
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginVertical: 4,
    minWidth: 180,
    alignItems: 'center',
  },
  modalItemText: {
    color: '#F2EFE7', // Cream text like main page
    fontSize: 16,
    fontWeight: '400',
    fontFamily: 'Poppins-Regular',
  },
  cancelButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#F2EFE7', // Cream border
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginTop: 12,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#F2EFE7', // Cream text like main page
    fontSize: 14,
    fontWeight: '400',
    fontFamily: 'Poppins-Regular',
  },
  signOutButton: {
    borderWidth: 2,
    borderColor: '#EF4444', // Red border for sign out
    backgroundColor: 'transparent',
    borderRadius: 50,
    height: 64,
    marginBottom: 16,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  signOutButtonText: {
    color: '#EF4444', // Red text for sign out
    fontSize: 18,
    fontWeight: '400',
    textAlign: 'center',
    fontFamily: 'Poppins-Regular',
  },
}); 