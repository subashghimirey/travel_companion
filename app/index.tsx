import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';

const HomeScreen = () => {
  const router = useRouter();

  const handleLogout = () => {
    // Add logic to handle logout
    router.push('/login');
  };

  const handleFindPlaces = () => {
    // Implement location API to find nearby places
    router.push('/nearby-places');
  };

  const handleAddImage = () => {
    // Implement camera or image picker API
    router.push('/add-image');
  };

  const handleWriteNotes = () => {
    // Implement File System API to write notes
    router.push('/write-notes');
  };

  const handleViewItinerary = () => {
    // Implement itinerary viewing
    router.push('/view-itinerary');
  };

  return (
    <View style={styles.container}>
      {/* Image at the top */}
      <Image
        source={require('../assets/images/travel.png')} // Replace with your image path
        style={styles.headerImage}
      />

      <View style={styles.header}>
        <Text style={styles.welcomeText}>Welcome Back, User!</Text>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <FontAwesome name="sign-out" size={24} color="white" />
        </TouchableOpacity>
      </View>

      <View style={styles.dashboard}>
        <TouchableOpacity style={styles.card} onPress={handleFindPlaces}>
          <FontAwesome name="map-marker" size={30} color="white" />
          <Text style={styles.cardTitle}>Find New Places to Visit</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.card} onPress={handleAddImage}>
          <FontAwesome name="camera" size={30} color="white" />
          <Text style={styles.cardTitle}>Add Photos from Your Travels</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.card} onPress={handleWriteNotes}>
          <FontAwesome name="file-text" size={30} color="white" />
          <Text style={styles.cardTitle}>Write Travel Notes</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.card} onPress={handleViewItinerary}>
          <FontAwesome name="book" size={30} color="white" />
          <Text style={styles.cardTitle}>View Itinerary</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f2f2f2',
  },
  headerImage: {
    width: 250,
    height: 185, // Adjust height as needed
    resizeMode: 'cover',
    borderRadius: 10,
    marginBottom: 20,
    marginLeft: 80,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  logoutButton: {
    padding: 10,
    backgroundColor: '#ff5733',
    borderRadius: 5,
  },
  dashboard: {
    flex: 1,
    justifyContent: 'center',
  },
  card: {
    backgroundColor: '#6372ff',
    padding: 20,
    marginBottom: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  cardTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
  },
});

export default HomeScreen;
