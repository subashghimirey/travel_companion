import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import * as Location from 'expo-location';
import axios from 'axios';

// Define the type for the places data
interface Place {
  fsq_id: string;
  name: string;
  location: {
    address: string;
  };
}

const FindPlacesScreen = () => {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [places, setPlaces] = useState<Place[]>([]); // Use the defined type for the places array
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    // Get the user's location when the component mounts
    getUserLocation();
  }, []);

  const getUserLocation = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      const location = await Location.getCurrentPositionAsync();
      setLocation(location);
      fetchNearbyPlaces(location.coords.latitude, location.coords.longitude); // Fetch places once we have the location
    } catch (error) {
      setErrorMsg('Error getting your location. Please try again.');
    }
  };

  const fetchNearbyPlaces = async (latitude: number, longitude: number) => {
    try {
      const apiKey = 'fsq3939vcV7Qn1Q8iZhkzHzWHXX/226iJ81OlhpRXapOV40='; // Replace with your Foursquare API key
      const radius = 5000; // 5km radius
      const limit = 10; // Limit the number of places to fetch

      // Foursquare API URL
      const url = `https://api.foursquare.com/v3/places/nearby?ll=${latitude},${longitude}&radius=${radius}&limit=${limit}`;

      // Set headers with the Foursquare API key
      const config = {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
        },
      };

      // Fetch places from Foursquare API
      const response = await axios.get(url, config);

      // Save the places in state
      setPlaces(response.data.results);
    } catch (error) {
      setErrorMsg('Error fetching places. Please try again.');
    }
  };

  const renderPlace = ({ item }: { item: Place }) => (  // Define type for item
    <TouchableOpacity style={styles.card}>
      <Text style={styles.cardTitle}>{item.name}</Text>
      <Text style={styles.cardDescription}>{item.location.address || 'Address not available'}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {errorMsg ? (
        <Text style={styles.errorText}>{errorMsg}</Text>
      ) : location ? (
        <>
          <Text style={styles.heading}>Nearby Places to Visit</Text>
          <FlatList
            data={places}
            renderItem={renderPlace}
            keyExtractor={(item) => item.fsq_id} // Unique identifier from Foursquare API
          />
        </>
      ) : (
        <Text style={styles.loadingText}>Loading your location...</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f2f2f2',
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#6372ff',
    padding: 15,
    marginBottom: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  cardTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  cardDescription: {
    color: 'white',
    fontSize: 14,
    marginTop: 5,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
  },
  loadingText: {
    textAlign: 'center',
    fontSize: 16,
  },
});

export default FindPlacesScreen;
