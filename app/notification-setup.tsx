import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useLocation } from '../components/LocationContext';
import DateTimePicker from '@react-native-community/datetimepicker';

const { width, height } = Dimensions.get('window');

interface Theater {
  id: string;
  name: string;
  location: string;
}

// Mock theaters data - in real app, this would come from API
const getMockTheaters = (location: string): Theater[] => [
  {
    id: '1',
    name: 'PVR Cinemas',
    location: location,
  },
  {
    id: '2',
    name: 'INOX Multiplex',
    location: location,
  },
  {
    id: '3',
    name: 'Cinepolis',
    location: location,
  },
  {
    id: '4',
    name: 'Miraj Cinemas',
    location: location,
  },
  {
    id: '5',
    name: 'Carnival Cinemas',
    location: location,
  },
  {
    id: '6',
    name: 'Fun Cinemas',
    location: location,
  },
];

export default function NotificationSetupScreen() {
  const router = useRouter();
  const { location } = useLocation();
  const params = useLocalSearchParams();
  
  const movieId = params.movieId as string;
  const movieTitle = params.movieTitle as string;
  const movieType = params.movieType as string;
  const releaseDate = params.releaseDate as string;

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState(new Date());
  const [selectedTheaters, setSelectedTheaters] = useState<string[]>([]);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [theaters, setTheaters] = useState<Theater[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load theaters for the location
    const loadTheaters = async () => {
      try {
        setLoading(true);
        // In real app, fetch from API: /theaters?location=${location}&movie_id=${movieId}
        const mockTheaters = getMockTheaters(location);
        setTheaters(mockTheaters);
      } catch (error) {
        console.error('Failed to load theaters:', error);
        // Fallback to mock data
        const mockTheaters = getMockTheaters(location);
        setTheaters(mockTheaters);
      } finally {
        setLoading(false);
      }
    };

    loadTheaters();
  }, [location, movieId]);

  const handleDateChange = (event: any, date?: Date) => {
    setShowDatePicker(false);
    if (date) {
      setSelectedDate(date);
    }
  };

  const handleTimeChange = (event: any, time?: Date) => {
    setShowTimePicker(false);
    if (time) {
      setSelectedTime(time);
    }
  };

  const toggleTheater = (theaterId: string) => {
    setSelectedTheaters(prev => 
      prev.includes(theaterId)
        ? prev.filter(id => id !== theaterId)
        : [...prev, theaterId]
    );
  };

  const selectAllTheaters = () => {
    setSelectedTheaters(theaters.map(theater => theater.id));
  };

  const deselectAllTheaters = () => {
    setSelectedTheaters([]);
  };

  const handleSubmit = () => {
    if (selectedTheaters.length === 0) {
      alert('Please select at least one theater');
      return;
    }

    // Navigate to confirmation screen with all the data
    router.push({
      pathname: '/confirmation',
      params: {
        movieId,
        movieTitle,
        movieType,
        releaseDate,
        selectedDate: selectedDate.toISOString(),
        selectedTime: selectedTime.toISOString(),
        selectedTheaters: selectedTheaters.join(','),
        location,
        type: 'notification',
      }
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notification Setup</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Movie Info */}
        <View style={styles.movieInfoSection}>
          <Text style={styles.sectionTitle}>Movie Details</Text>
          <View style={styles.movieCard}>
            <Text style={styles.movieTitle}>{movieTitle}</Text>
            <Text style={styles.movieType}>
              {movieType === 'upcoming' ? 'Coming Soon' : 'Now Showing'}
            </Text>
            <Text style={styles.releaseDate}>Release: {releaseDate}</Text>
          </View>
        </View>

        {/* Date Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Select Date</Text>
          <View style={styles.dateTimeContainer}>
            <TouchableOpacity
              style={styles.dateTimeButton}
              onPress={() => setShowDatePicker(true)}
            >
              <Text style={styles.dateTimeButtonText}>
                {formatDate(selectedDate)}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => setShowDatePicker(true)}
            >
              <Text style={styles.editButtonText}>Edit</Text>
            </TouchableOpacity>
          </View>
          {showDatePicker && (
            <DateTimePicker
              value={selectedDate}
              mode="date"
              display="default"
              onChange={handleDateChange}
              minimumDate={new Date()}
              maximumDate={new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)} // 30 days from now
            />
          )}
        </View>

        {/* Time Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Select Time</Text>
          <View style={styles.dateTimeContainer}>
            <TouchableOpacity
              style={styles.dateTimeButton}
              onPress={() => setShowTimePicker(true)}
            >
              <Text style={styles.dateTimeButtonText}>
                {formatTime(selectedTime)}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => setShowTimePicker(true)}
            >
              <Text style={styles.editButtonText}>Edit</Text>
            </TouchableOpacity>
          </View>
          {showTimePicker && (
            <DateTimePicker
              value={selectedTime}
              mode="time"
              display="default"
              onChange={handleTimeChange}
            />
          )}
        </View>

        {/* Theater Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Select Theaters</Text>
          
          <View style={styles.selectAllContainer}>
            <TouchableOpacity
              style={styles.selectAllButton}
              onPress={selectAllTheaters}
            >
              <Text style={styles.selectAllButtonText}>Select All</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.selectAllButton}
              onPress={deselectAllTheaters}
            >
              <Text style={styles.selectAllButtonText}>Deselect All</Text>
            </TouchableOpacity>
          </View>

          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#F2EFE7" />
              <Text style={styles.loadingText}>Loading theaters...</Text>
            </View>
          ) : (
            <View style={styles.theatersContainer}>
              {theaters.map((theater) => (
                <TouchableOpacity
                  key={theater.id}
                  style={[
                    styles.theaterCard,
                    selectedTheaters.includes(theater.id) && styles.selectedTheaterCard
                  ]}
                  onPress={() => toggleTheater(theater.id)}
                >
                  <Text style={[
                    styles.theaterName,
                    selectedTheaters.includes(theater.id) && styles.selectedTheaterName
                  ]}>
                    {theater.name}
                  </Text>
                  <Text style={[
                    styles.theaterLocation,
                    selectedTheaters.includes(theater.id) && styles.selectedTheaterLocation
                  ]}>
                    {theater.location}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* Submit Button */}
        <View style={styles.submitSection}>
          <TouchableOpacity
            style={[
              styles.submitButton,
              selectedTheaters.length === 0 && styles.submitButtonDisabled
            ]}
            onPress={handleSubmit}
            disabled={selectedTheaters.length === 0}
          >
            <Text style={styles.submitButtonText}>
              Set Up Notification
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#374151', // Dark gray container like home page
    minHeight: '100%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 20,
    backgroundColor: '#48A6A7', // Teal background like home page content area
    borderBottomWidth: 2,
    borderBottomColor: '#F2EFE7', // Cream border
  },
  backButton: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#F2EFE7',
    borderRadius: 8,
    backgroundColor: 'transparent',
  },
  backButtonText: {
    color: '#F2EFE7', // Cream text like home page
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
  },
  headerTitle: {
    color: '#F2EFE7', // Cream text like home page
    fontSize: 24,
    fontWeight: '700', // Bold weight
    fontFamily: 'Poppins-Regular',
  },
  placeholder: {
    width: 60, // Same width as back button for centering
  },
  scrollView: {
    flex: 1,
    backgroundColor: '#48A6A7', // Teal background like home page content area
  },
  movieInfoSection: {
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  section: {
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    color: '#F2EFE7', // Cream text like home page
    fontSize: 24,
    fontWeight: '700', // Bold weight
    fontFamily: 'Poppins-Regular',
    marginBottom: 20,
    textAlign: 'center',
  },
  movieCard: {
    backgroundColor: '#F2EFE7', // Cream background
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  movieTitle: {
    color: '#374151', // Dark gray text
    fontSize: 20,
    fontWeight: '700', // Bold weight
    fontFamily: 'Poppins-Regular',
    textAlign: 'center',
    marginBottom: 8,
  },
  movieType: {
    color: '#48A6A7', // Teal text
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
    marginBottom: 4,
  },
  releaseDate: {
    color: '#6B7280', // Gray text
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
  },
  dateTimeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  dateTimeButton: {
    backgroundColor: '#F2EFE7', // Cream background
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    flex: 1,
  },
  editButton: {
    backgroundColor: '#EF4444', // Red background
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  editButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'Poppins-SemiBold',
  },
  dateTimeButtonText: {
    color: '#374151', // Dark gray text
    fontSize: 18,
    fontFamily: 'Poppins-Medium',
  },
  selectAllContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  selectAllButton: {
    backgroundColor: '#EF4444', // Red background
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    flex: 0.48,
    alignItems: 'center',
  },
  selectAllButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
  },
  theatersContainer: {
    gap: 12,
  },
  theaterCard: {
    backgroundColor: '#F2EFE7', // Cream background
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  selectedTheaterCard: {
    backgroundColor: '#48A6A7', // Teal background when selected
    borderWidth: 2,
    borderColor: '#F2EFE7', // Cream border
  },
  theaterName: {
    color: '#374151', // Dark gray text
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Poppins-SemiBold',
    marginBottom: 4,
  },
  selectedTheaterName: {
    color: '#FFFFFF', // White text when selected
  },
  theaterLocation: {
    color: '#6B7280', // Gray text
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
  },
  selectedTheaterLocation: {
    color: '#E5E7EB', // Light gray text when selected
  },
  submitSection: {
    paddingVertical: 30,
    paddingHorizontal: 20,
  },
  submitButton: {
    backgroundColor: '#10B981', // Green background
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  submitButtonDisabled: {
    backgroundColor: '#9CA3AF', // Gray background when disabled
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    fontFamily: 'Poppins-SemiBold',
  },
  loadingContainer: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  loadingText: {
    color: '#F2EFE7', // Cream text like home page
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    marginTop: 16,
  },
}); 