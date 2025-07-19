import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Image,
  Animated,
  Platform,
  Easing,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useLocation } from '../components/LocationContext';

interface Movie {
  id: string;
  title: string;
  poster: string;
  type: 'upcoming' | 'running';
  releaseDate: string;
  overview?: string;
  rating?: number;
}

const { width, height } = Dimensions.get('window');

// Real movie data fetching from BookMyShow
const fetchMovies = async (currentLocation: string = 'mumbai'): Promise<Movie[]> => {
  try {
    // Fetch movies from BookMyShow API
    const response = await fetch(
      `http://localhost:8000/movies/bookmyshow?location=${currentLocation}&force_scrape=false`
    );
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data.movies && data.movies.length > 0) {
      // Transform backend movie data to frontend format
      const transformedMovies: Movie[] = data.movies.map((movie: any) => ({
        id: movie.movie_id || movie.id || Math.random().toString(),
        title: movie.title,
        poster: movie.poster_url || 'https://via.placeholder.com/300x450/48A6A7/FFFFFF?text=No+Poster',
        type: movie.movie_type === 'running' ? 'running' : 'upcoming',
        releaseDate: movie.release_date,
        overview: movie.overview || '',
        rating: movie.rating || undefined,
      }));
      
      return transformedMovies;
    } else {
      // If no movies from BookMyShow, try to trigger scraping
      console.log('No movies found, triggering fresh scrape...');
      const scrapeResponse = await fetch(
        `http://localhost:8000/movies/bookmyshow?location=${currentLocation}&force_scrape=true`
      );
      
      if (scrapeResponse.ok) {
        const scrapeData = await scrapeResponse.json();
        if (scrapeData.movies && scrapeData.movies.length > 0) {
          const transformedMovies: Movie[] = scrapeData.movies.map((movie: any) => ({
            id: movie.movie_id || movie.id || Math.random().toString(),
            title: movie.title,
            poster: movie.poster_url || 'https://via.placeholder.com/300x450/48A6A7/FFFFFF?text=No+Poster',
            type: movie.movie_type === 'running' ? 'running' : 'upcoming',
            releaseDate: movie.release_date,
            overview: movie.overview || '',
            rating: movie.rating || undefined,
          }));
          return transformedMovies;
        }
      }
      
      // Fallback to mock data if scraping also fails
      return getMockMovies();
    }
  } catch (error) {
    console.error('Error fetching movies from BookMyShow:', error);
    // Fallback to mock data if API fails
    return getMockMovies();
  }
};

// Fallback mock data
const getMockMovies = (): Movie[] => [
  {
    id: '1',
    title: 'F1: The Movie',
    poster: 'https://via.placeholder.com/300x450/48A6A7/FFFFFF?text=F1+Movie',
    type: 'upcoming',
    releaseDate: '2025-07-15',
    rating: 8.5,
  },
  {
    id: '2',
    title: 'Avengers: Secret Wars',
    poster: 'https://via.placeholder.com/300x450/EF4444/FFFFFF?text=Avengers',
    type: 'upcoming',
    releaseDate: '2025-08-01',
    rating: 9.2,
  },
  {
    id: '3',
    title: 'Spider-Man: Beyond',
    poster: 'https://via.placeholder.com/300x450/10B981/FFFFFF?text=Spider-Man',
    type: 'running',
    releaseDate: '2025-06-20',
    rating: 7.8,
  },
  {
    id: '4',
    title: 'Batman: Gotham Knights',
    poster: 'https://via.placeholder.com/300x450/8B5CF6/FFFFFF?text=Batman',
    type: 'upcoming',
    releaseDate: '2025-07-30',
    rating: 8.9,
  },
  {
    id: '5',
    title: 'Wonder Woman 3',
    poster: 'https://via.placeholder.com/300x450/F59E0B/FFFFFF?text=Wonder+Woman',
    type: 'running',
    releaseDate: '2025-06-25',
    rating: 7.5,
  },
  {
    id: '6',
    title: 'Black Panther: Wakanda Forever 2',
    poster: 'https://via.placeholder.com/300x450/374151/FFFFFF?text=Black+Panther',
    type: 'upcoming',
    releaseDate: '2025-08-15',
    rating: 8.7,
  },
];

// Initialize with mock data, will be replaced by API data
let trendingMovies: Movie[] = getMockMovies();

// All movies will be the same as trending movies for now
let allMovies: Movie[] = trendingMovies;

export default function MovieSelectionScreen() {
  const router = useRouter();
  const { location } = useLocation();
  const [currentTrendingIndex, setCurrentTrendingIndex] = useState(0);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [movies, setMovies] = useState<Movie[]>(getMockMovies());
  const [loading, setLoading] = useState(true);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  // Fetch real movie data on component mount
  useEffect(() => {
    const loadMovies = async () => {
      try {
        setLoading(true);
        const currentLocation = location || 'mumbai';
        const fetchedMovies = await fetchMovies(currentLocation);
        if (fetchedMovies && fetchedMovies.length > 0) {
          setMovies(fetchedMovies);
          trendingMovies = fetchedMovies;
          allMovies = fetchedMovies;
        } else {
          // Fallback to mock data if API returns empty array
          const mockMovies = getMockMovies();
          setMovies(mockMovies);
          trendingMovies = mockMovies;
          allMovies = mockMovies;
        }
      } catch (error) {
        console.error('Failed to load movies:', error);
        // Fallback to mock data on error
        const mockMovies = getMockMovies();
        setMovies(mockMovies);
        trendingMovies = mockMovies;
        allMovies = mockMovies;
      } finally {
        setLoading(false);
      }
    };

    loadMovies();
  }, [location]);

  // Auto-rotate trending movies with smooth transitions
  useEffect(() => {
    const interval = setInterval(() => {
      // Smooth fade out with scale
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 800,
          useNativeDriver: true,
          easing: Easing.inOut(Easing.ease),
        }),
        Animated.timing(scaleAnim, {
          toValue: 0.95,
          duration: 800,
          useNativeDriver: true,
          easing: Easing.inOut(Easing.ease),
        }),
      ]).start(() => {
        // Change movie after fade out
        setCurrentTrendingIndex((prevIndex) => 
          (prevIndex + 1) % Math.min(4, movies.length)
        );
        
        // Smooth fade in with scale
        Animated.parallel([
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
            easing: Easing.inOut(Easing.ease),
          }),
          Animated.timing(scaleAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
            easing: Easing.inOut(Easing.ease),
          }),
        ]).start();
      });
    }, 4000); // Slightly faster rotation

    return () => clearInterval(interval);
  }, [fadeAnim, movies]);

  const handleMovieSelect = (movie: Movie) => {
    setSelectedMovie(movie);
    // Navigate to notification setup with movie data
    router.push({
      pathname: '/notification-setup',
      params: { 
        movieId: movie.id,
        movieTitle: movie.title,
        movieType: movie.type,
        releaseDate: movie.releaseDate,
      }
    });
  };

  const handleNotifyMe = (movie: Movie) => {
    // Navigate to notification setup screen with movie data
    router.push({
      pathname: '/notification-setup',
      params: { 
        movieId: movie.id,
        movieTitle: movie.title,
        movieType: movie.type,
        releaseDate: movie.releaseDate,
      }
    });
  };

  const getCurrentTrendingMovies = () => {
    const startIndex = currentTrendingIndex;
    const trendingMoviesList = [];
    for (let i = 0; i < 4; i++) {
      const index = (startIndex + i) % movies.length;
      trendingMoviesList.push(movies[index]);
    }
    return trendingMoviesList;
  };

  const renderTrendingMovie = (movie: Movie, index: number) => {
    const isMain = index === 0;
    const scale = isMain ? 1 : 0.8;
    const opacity = isMain ? 1 : 0.7;
    const zIndex = isMain ? 10 : 5 - index;

    return (
      <Animated.View
        key={movie.id}
        style={[
          styles.trendingMovieContainer,
          {
            transform: [{ scale: isMain ? scaleAnim : scale }],
            opacity,
            zIndex,
          },
          isMain && { opacity: fadeAnim }
        ]}
      >
        <TouchableOpacity
          style={styles.trendingMovieCard}
          onPress={() => handleMovieSelect(movie)}
          activeOpacity={0.8}
        >
          <Image 
            source={{ uri: movie.poster }} 
            style={styles.trendingMoviePoster}
            onError={() => console.log('Failed to load trending movie poster:', movie.title)}
          />
          <View style={styles.trendingMovieOverlay}>
            <Text style={styles.trendingMovieTitle}>{movie.title}</Text>
            <View style={styles.trendingMovieBadge}>
              <Text style={styles.trendingMovieBadgeText}>
                {movie.type === 'upcoming' ? 'Coming Soon' : 'Now Showing'}
              </Text>
            </View>
            <View style={styles.buttonContainer}>
              <TouchableOpacity 
                style={styles.notifyMeButton}
                onPress={() => handleNotifyMe(movie)}
              >
                <Text style={styles.notifyMeButtonText}>Notify Me</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.moreInfoButton}>
                <Text style={styles.moreInfoButtonText}>More Info</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  const renderMovieCard = (movie: Movie) => (
    <TouchableOpacity
      key={movie.id}
      style={styles.movieCard}
      onPress={() => handleMovieSelect(movie)}
      activeOpacity={0.8}
    >
      <View style={styles.moviePosterContainer}>
        <Image 
          source={{ uri: movie.poster }} 
          style={styles.moviePoster}
          onError={() => console.log('Failed to load movie poster:', movie.title)}
        />
        {movie.rating !== undefined && movie.rating > 0 && (
          <View style={styles.ratingBadge}>
            <Text style={styles.ratingText}>★ {movie.rating.toFixed(1)}</Text>
          </View>
        )}
        <View style={styles.movieTypeBadge}>
          <Text style={styles.movieTypeText}>
            {movie.type === 'upcoming' ? 'Coming Soon' : 'Now Showing'}
          </Text>
        </View>
      </View>
      <View style={styles.movieInfo}>
        <View style={styles.titlePosterContainer}>
          <Text style={styles.movieTitle} numberOfLines={2}>{movie.title}</Text>
        </View>
        <Text style={styles.movieSubtitle}>Tap to select</Text>
      </View>
    </TouchableOpacity>
  );

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
        <Text style={styles.headerTitle}>Movie Selection</Text>
        <Text style={styles.locationText}>{location}</Text>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Trending Movies Section */}
        <View style={styles.trendingSection}>
          <Text style={styles.sectionTitle}>Trending Movies</Text>
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#F2EFE7" />
              <Text style={styles.loadingText}>Loading movies...</Text>
            </View>
          ) : (
            <View style={styles.trendingContainer}>
              {getCurrentTrendingMovies().map((movie, index) => 
                renderTrendingMovie(movie, index)
              )}
            </View>
          )}
        </View>

        {/* All Movies Section */}
        <View style={styles.allMoviesSection}>
          <Text style={styles.sectionTitle}>All Movies</Text>
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#F2EFE7" />
              <Text style={styles.loadingText}>Loading movies...</Text>
            </View>
          ) : (
            <View style={styles.moviesGrid}>
              {movies.map(renderMovieCard)}
            </View>
          )}
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
  locationText: {
    color: '#F2EFE7', // Cream text like home page
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
  },
  scrollView: {
    flex: 1,
    backgroundColor: '#48A6A7', // Teal background like home page content area
  },
  trendingSection: {
    paddingVertical: 20,
    paddingHorizontal: 20,
    height: height * 0.6, // Cover 60% of screen height
  },
  sectionTitle: {
    color: '#F2EFE7', // Cream text like home page
    fontSize: 28,
    fontWeight: '700', // Bold weight
    fontFamily: 'Poppins-Regular',
    marginBottom: 20,
    textAlign: 'center',
  },
  trendingContainer: {
    flex: 1,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  trendingMovieContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  trendingMovieCard: {
    width: 280,
    height: 380,
    borderRadius: 15,
    overflow: 'hidden',
    backgroundColor: '#E5E7EB', // Light gray background for poster area
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    borderWidth: 2,
    borderColor: '#F2EFE7', // Cream border like home page elements
  },
  trendingMoviePoster: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  trendingMovieOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: 15,
  },
  trendingMovieTitle: {
    color: '#F2EFE7', // Cream text like home page
    fontSize: 18,
    fontWeight: '700', // Bold Poppins for titles
    fontFamily: 'Poppins-Bold',
    marginBottom: 8,
  },
  trendingMovieBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#EF4444', // Red like sign out button
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  trendingMovieBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '500',
    fontFamily: 'Poppins-Medium',
  },
  notifyMeButton: {
    backgroundColor: '#48A6A7', // Teal background like home page
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#F2EFE7', // Cream border
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notifyMeButtonText: {
    color: '#F2EFE7', // Cream text like home page
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'Poppins-SemiBold',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  moreInfoButton: {
    backgroundColor: '#48A6A7', // Teal background like Notify Me button
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#F2EFE7', // Cream border
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  moreInfoButtonText: {
    color: '#F2EFE7', // Cream text like home page
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'Poppins-SemiBold',
  },
  allMoviesSection: {
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  moviesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 8,
  },
  movieCard: {
    width: (width - 80) / 3 - 6, // 3 columns with proper spacing and gap
    height: 400, // Adjusted height for better portrait proportions
    marginBottom: 20,
    backgroundColor: '#F2EFE7', // Cream background like home page elements
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    borderWidth: 1,
    borderColor: '#F2EFE7', // Cream border like home page elements
    flexDirection: 'column',
  },
  moviePosterContainer: {
    position: 'relative',
    backgroundColor: '#E5E7EB', // Light gray background for poster container
    height: 320, // Slightly shorter to ensure full poster visibility
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8, // Add padding to ensure posters don't touch edges
  },
  moviePoster: {
    width: '100%',
    height: '100%', // Fill the container for proper portrait proportions
    resizeMode: 'contain',
  },
  ratingBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 10,
  },
  ratingText: {
    color: '#F2EFE7',
    fontSize: 10,
    fontWeight: '600',
    fontFamily: 'Poppins-SemiBold',
  },
  movieTypeBadge: {
    position: 'absolute',
    bottom: 6,
    left: 6,
    backgroundColor: '#48A6A7',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 10,
  },
  movieTypeText: {
    color: '#F2EFE7',
    fontSize: 9,
    fontWeight: '600',
    fontFamily: 'Poppins-SemiBold',
  },
  movieInfo: {
    padding: 8,
    paddingBottom: 12, // Reduced bottom padding
    alignItems: 'center',
    backgroundColor: '#F2EFE7',
    flex: 1,
    justifyContent: 'center', // Center the content vertically
    minHeight: 80, // Reduced height for more compact layout
  },
  movieTitle: {
    color: '#FFFFFF', // White text for poster-style appearance
    fontSize: 16,
    fontWeight: '400', // Regular Poppins for titles
    fontFamily: 'Poppins-Regular',
    textAlign: 'center',
    lineHeight: 18,
    minHeight: 22, // Keep the same height
  },
  movieSubtitle: {
    color: '#6B7280', // Gray text
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
    textAlign: 'center',
    marginTop: 2,
    alignSelf: 'center',
  },
  titlePosterContainer: {
    backgroundColor: '#48A6A7', // Teal background like poster
    borderRadius: 8,
    padding: 6,
    marginBottom: 6,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    alignSelf: 'stretch',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    color: '#F2EFE7', // Cream text like home page
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    marginTop: 16,
  },
}); 