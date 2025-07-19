import { View, StyleSheet, Dimensions, TouchableOpacity, Platform, Modal } from 'react-native';
import { Text } from 'react-native-paper';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { useLocation, Location } from '../../components/LocationContext';

const { width, height } = Dimensions.get('window');

const LOCATIONS: Location[] = ['Mumbai', 'Delhi', 'Kochi'];

export default function HomeScreen() {
  const router = useRouter();
  const { location, setLocation } = useLocation();
  const [hoveredButton, setHoveredButton] = useState<string | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleButtonPress = (route: '/movie-selection' | '/request-history') => {
    router.push(route);
  };

  const handleLocationSelect = (selectedLocation: Location) => {
    setLocation(selectedLocation);
    setDropdownOpen(false);
  };

  return (
    <View style={styles.container}>
      {/* TOP DROPDOWN - SUPER VISIBLE */}
      <View style={styles.topDropdownArea}>
        <Text style={styles.topDebugText}>🚨 TOP DROPDOWN AREA 🚨</Text>
        <TouchableOpacity
          style={styles.topDropdownButton}
          onPress={() => {
            console.log('TOP DROPDOWN TAPPED!');
            alert('TOP DROPDOWN TAPPED!');
            setDropdownOpen(true);
          }}
        >
          <Text style={styles.topDropdownText}>
            🎯 CLICK HERE TO SELECT LOCATION 🎯
          </Text>
        </TouchableOpacity>
      </View>

      {/* Main Content Panel */}
      <View style={styles.mainPanel}>
        <View style={styles.content}>
          {/* Main Title */}
          <Text style={styles.title}>
            Flash Flicker
          </Text>

          {/* Action Buttons */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[
                styles.actionButton,
                hoveredButton === 'create' && styles.buttonHovered
              ]}
              onPress={() => handleButtonPress('/movie-selection')}
              onPressIn={() => Platform.OS === 'web' ? null : setHoveredButton('create')}
              onPressOut={() => Platform.OS === 'web' ? null : setHoveredButton(null)}
              {...(Platform.OS === 'web' && {
                onMouseEnter: () => setHoveredButton('create'),
                onMouseLeave: () => setHoveredButton(null),
              })}
              activeOpacity={Platform.OS === 'web' ? 1 : 0.8}
            >
              <Text style={[
                styles.buttonText,
                hoveredButton === 'create' && styles.buttonTextHovered
              ]}>
                Create a New Notification
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.actionButton,
                hoveredButton === 'history' && styles.buttonHovered
              ]}
              onPress={() => handleButtonPress('/request-history')}
              onPressIn={() => Platform.OS === 'web' ? null : setHoveredButton('history')}
              onPressOut={() => Platform.OS === 'web' ? null : setHoveredButton(null)}
              {...(Platform.OS === 'web' && {
                onMouseEnter: () => setHoveredButton('history'),
                onMouseLeave: () => setHoveredButton(null),
              })}
              activeOpacity={Platform.OS === 'web' ? 1 : 0.8}
            >
              <Text style={[
                styles.buttonText,
                hoveredButton === 'history' && styles.buttonTextHovered
              ]}>
                View Request History
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
                alert('Selected: Delhi');
              }}
            >
              <Text style={styles.modalItemText}>🏛️ Delhi</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.modalItem}
              onPress={() => {
                handleLocationSelect('Kochi');
                alert('Selected: Kochi');
              }}
            >
              <Text style={styles.modalItemText}>🌊 Kochi</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.modalItem}
              onPress={() => {
                handleLocationSelect('Mumbai');
                alert('Selected: Mumbai');
              }}
            >
              <Text style={styles.modalItemText}>🏙️ Mumbai</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setDropdownOpen(false)}
            >
              <Text style={styles.cancelButtonText}>❌ Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    minHeight: height,
    backgroundColor: '#374151', // bg-gray-800
  },
  topDropdownArea: {
    backgroundColor: '#FF0000',
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 5,
    borderBottomColor: '#FFFFFF',
  },
  topDebugText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  topDropdownButton: {
    backgroundColor: '#FFFF00',
    borderWidth: 4,
    borderColor: '#000000',
    borderRadius: 15,
    paddingVertical: 20,
    paddingHorizontal: 30,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 80,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.8,
    shadowRadius: 16,
    elevation: 20,
  },
  topDropdownText: {
    color: '#000000',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  mainPanel: {
    height: height,
  },
  content: {
    backgroundColor: '#48A6A7',
    height: '100%',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 80, // p-20
  },
  title: {
    color: '#F2EFE7',
    fontSize: 72, // text-7xl
    fontWeight: '300', // font-light
    letterSpacing: 2, // tracking-wide
    textAlign: 'center',
    fontFamily: 'Preahvihear',
    marginBottom: 48, // space-y-12
  },
  dropdownContainer: {
    width: '100%',
    maxWidth: 448, // max-w-md
    marginBottom: 48, // space-y-12
    // Debug: Add background to see if container is visible
    backgroundColor: 'rgba(255, 0, 0, 0.1)',
  },
  dropdownTrigger: {
    height: 56, // h-14
    backgroundColor: 'rgba(255, 255, 255, 0.1)', // Make it slightly visible
    borderWidth: 2,
    borderColor: '#F2EFE7',
    borderRadius: 50, // rounded-full
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    // Debug: Add shadow to make it more visible
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  dropdownValue: {
    color: '#F2EFE7',
    fontSize: 18, // text-lg
    fontFamily: 'Poppins-Regular',
  },
  debugText: {
    color: '#FF0000',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 16,
    fontWeight: 'bold',
  },
  simpleDropdown: {
    backgroundColor: '#FF0000',
    borderWidth: 3,
    borderColor: '#FFFFFF',
    borderRadius: 25,
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 60,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 10,
  },
  simpleDropdownText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    margin: 40,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 15,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#48A6A7',
    marginBottom: 20,
    textAlign: 'center',
  },
  modalItem: {
    backgroundColor: '#48A6A7',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
    marginVertical: 8,
    minWidth: 200,
    alignItems: 'center',
  },
  modalItemText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  cancelButton: {
    backgroundColor: '#FF6B6B',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginTop: 16,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dropdownContent: {
    backgroundColor: '#F2EFE7',
    borderWidth: 2,
    borderColor: '#48A6A7',
    borderRadius: 8,
    padding: 4,
    minWidth: 200,
  },
  dropdownItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#48A6A7',
  },
  dropdownItemText: {
    color: '#48A6A7',
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
  },
  buttonContainer: {
    flexDirection: 'column',
    gap: 32, // gap-8
    width: '100%',
    maxWidth: 896, // max-w-4xl
  },
  actionButton: {
    flex: 1,
    height: 64, // h-16
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#F2EFE7',
    borderRadius: 50, // rounded-full
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  buttonHovered: {
    backgroundColor: '#F2EFE7',
    borderColor: '#F2EFE7',
  },
  buttonText: {
    color: '#F2EFE7',
    fontSize: 18, // text-lg
    fontFamily: 'Poppins-Regular',
    textAlign: 'center',
  },
  buttonTextHovered: {
    color: '#48A6A7',
  },
});
