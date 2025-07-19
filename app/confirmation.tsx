import { View, ScrollView, StyleSheet, Platform, TouchableOpacity } from 'react-native';
import { Text, Snackbar } from 'react-native-paper';
import React, { useState } from 'react';
import { useLocation } from '../components/LocationContext';
import { useRouter, useLocalSearchParams } from 'expo-router';

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
  const params = useLocalSearchParams();

  // Check if this is a notification setup or regular movie selection
  const isNotificationSetup = params.type === 'notification';

  // Get data from params for notification setup, or from context for regular selection
  const movieTitle = isNotificationSetup ? (params.movieTitle as string) : selectedMovie?.title;
  const movieType = isNotificationSetup ? (params.movieType as string) : 'upcoming'; // Default for regular selection
  const releaseDate = isNotificationSetup ? (params.releaseDate as string) : selectedMovie?.release_date;
  const requestDate = isNotificationSetup ? new Date(params.selectedDate as string) : selectedDate;
  const requestTime = isNotificationSetup ? new Date(params.selectedTime as string) : null;
  const theaterIds = isNotificationSetup ? (params.selectedTheaters as string).split(',') : selectedTheaters;
  const requestLocation = isNotificationSetup ? (params.location as string) : location;

  // Mock theater names for summary (in real app, fetch names by ID)
  const theaterNames = theaterIds.map((id, idx) => `Theater ${idx + 1}`).join(', ');

  const formatDate = (date: Date | null | string) => {
    if (!date) return 'Not selected';
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    if (isNaN(dateObj.getTime())) return 'Invalid date';
    return dateObj.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (date: Date | null) => {
    if (!date) return 'Not selected';
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleSubmit = () => {
    setShowSuccess(true);
    
    // Reset context for new request (only for regular selection)
    if (!isNotificationSetup) {
      setSelectedMovie(null);
      setSelectedTheaters([]);
      setSelectedDate(null);
    }
    
    setTimeout(() => {
      setShowSuccess(false);
      router.replace('/');
    }, 1500);
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
        <Text style={styles.headerTitle}>
          {isNotificationSetup ? 'Notification Setup' : 'Confirm Request'}
        </Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <Text style={styles.mainTitle}>
            {isNotificationSetup ? 'Notification Details' : 'Request Summary'}
          </Text>

          {/* Movie Information */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Movie Information</Text>
            <View style={styles.card}>
              <Text style={styles.movieTitle}>{movieTitle}</Text>
              <Text style={styles.movieType}>
                {movieType === 'upcoming' ? 'Coming Soon' : 'Now Showing'}
              </Text>
              <Text style={styles.releaseDate}>Release: {releaseDate}</Text>
            </View>
          </View>

          {/* Location */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Location</Text>
            <View style={styles.card}>
              <Text style={styles.cardText}>{requestLocation}</Text>
            </View>
          </View>

          {/* Date and Time */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {isNotificationSetup ? 'Notification Date & Time' : 'Selected Date'}
            </Text>
            <View style={styles.card}>
              <Text style={styles.cardText}>Date: {formatDate(requestDate)}</Text>
              {isNotificationSetup && requestTime && (
                <Text style={styles.cardText}>Time: {formatTime(requestTime)}</Text>
              )}
            </View>
          </View>

          {/* Theaters */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Selected Theaters</Text>
            <View style={styles.card}>
              <Text style={styles.cardText}>{theaterNames}</Text>
            </View>
          </View>

          {/* Submit Button */}
          <View style={styles.submitSection}>
            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleSubmit}
            >
              <Text style={styles.submitButtonText}>
                {isNotificationSetup ? 'Set Up Notification' : 'Submit Request'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      <Snackbar
        visible={showSuccess}
        onDismiss={() => setShowSuccess(false)}
        duration={1500}
        style={styles.snackbar}
      >
        {isNotificationSetup ? 'Notification set up successfully!' : 'Request submitted!'}
      </Snackbar>
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
  content: {
    padding: 20,
  },
  mainTitle: {
    color: '#F2EFE7', // Cream text like home page
    fontSize: 28,
    fontWeight: '700', // Bold weight
    fontFamily: 'Poppins-Regular',
    textAlign: 'center',
    marginBottom: 30,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    color: '#F2EFE7', // Cream text like home page
    fontSize: 20,
    fontWeight: '600',
    fontFamily: 'Poppins-SemiBold',
    marginBottom: 12,
  },
  card: {
    backgroundColor: '#F2EFE7', // Cream background
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  movieTitle: {
    color: '#374151', // Dark gray text
    fontSize: 18,
    fontWeight: '700', // Bold weight
    fontFamily: 'Poppins-Regular',
    marginBottom: 8,
  },
  movieType: {
    color: '#48A6A7', // Teal text
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
    marginBottom: 4,
  },
  releaseDate: {
    color: '#6B7280', // Gray text
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
  },
  cardText: {
    color: '#374151', // Dark gray text
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
  },
  submitSection: {
    marginTop: 20,
    marginBottom: 40,
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
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    fontFamily: 'Poppins-SemiBold',
  },
  snackbar: {
    backgroundColor: '#10B981', // Green background
  },
}); 