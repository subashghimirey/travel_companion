import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity } from 'react-native';
import * as Location from 'expo-location';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native'; // Import useNavigation hook

// Define the structure for the placesByCountry
type PlacesByCountry = {
  [key: string]: string[];  // This means the keys are country names, and values are arrays of strings (places)
};

// Predefined places by country
const placesByCountry: PlacesByCountry = {
  Nepal: ["Pokhara", "Chitwan", "Lumbini", "Kathmandu", "Mount Everest", "Patan", "Bhaktapur", "Nagarkot", "Rara Lake", "Bandipur"],
  USA: ["New York", "Los Angeles", "San Francisco", "Miami", "Las Vegas", "Chicago", "Hawaii", "Grand Canyon", "Yellowstone", "Washington DC"],
  India: ["Agra", "Jaipur", "Delhi", "Mumbai", "Goa", "Kerala", "Darjeeling", "Shimla", "Leh", "Varanasi"],
  Canada: ["Toronto", "Vancouver", "Montreal", "Ottawa", "Niagara Falls", "Banff", "Whistler", "Quebec City", "Calgary", "Victoria"],
  Germany: ["Berlin", "Munich", "Frankfurt", "Hamburg", "Cologne", "Dresden", "Bavarian Alps", "Lake Constance", "Rothenburg", "Hamburg"],
  Australia: ["Sydney", "Melbourne", "Brisbane", "Great Barrier Reef", "Perth", "Gold Coast", "Tasmania", "Adelaide", "Cairns", "Uluru"],
  UK: ["London", "Edinburgh", "Liverpool", "Manchester", "Bristol", "Oxford", "Cambridge", "York", "Bath", "Cardiff"],
  France: ["Paris", "Nice", "Lyon", "Marseille", "Bordeaux", "Toulouse", "Mont Saint-Michel", "Versailles", "Nantes", "Strasbourg"],
  Japan: ["Tokyo", "Kyoto", "Osaka", "Hokkaido", "Fukuoka", "Nara", "Hiroshima", "Okinawa", "Sapporo", "Nagoya"],
  Italy: ["Rome", "Venice", "Florence", "Milan", "Naples", "Amalfi Coast", "Tuscany", "Sicily", "Cinque Terre", "Verona"]
};

// Country mapping to handle full names to short names
const countryMapping: Record<string, string> = {
  "United States": "USA",
  "United Kingdom": "UK",
  "Nepal": "Nepal",
  "Canada": "Canada",
  "Germany": "Germany",
  "Australia": "Australia",
  "France": "France",
  "Japan": "Japan",
  "Italy": "Italy",
  // Add any other necessary mappings here
};

const FindPlacesScreen = () => {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [country, setCountry] = useState<string | null>(null);
  const [city, setCity] = useState<string | null>(null);
  const [places, setPlaces] = useState<string[]>([]);
  const [errorMsg, setErrorMsg] = useState('');
  
  // Use navigation hook for navigation
  const navigation = useNavigation();

  useEffect(() => {
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

      const { latitude, longitude } = location.coords;
      fetchLocationDetails(latitude, longitude);
    } catch (error) {
      setErrorMsg('Error getting location details');
    }
  };

  const fetchLocationDetails = async (latitude: number, longitude: number) => {
    try {
      // Use OpenCage or other reverse geocoding API to get city and country
      const apiKey = '1480990bea1a43b5a347476ee0dd7657'; // Replace with your OpenCage API key
      const url = `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=${apiKey}`;
      const response = await axios.get(url);

      const result = response.data.results[0];
      if (result) {
        const city = result.components.city || result.components.town || result.components.village;
        const country = result.components.country;

        // Normalize the country using the mapping
        const normalizedCountry = countryMapping[country] || country;

        setCity(city || "Unknown City");
        setCountry(normalizedCountry || "Unknown Country");

        console.log('Detected country:', normalizedCountry); // Log the normalized country for debugging

        // Fetch places based on normalized country name
        if (normalizedCountry && placesByCountry[normalizedCountry]) {
          setPlaces(placesByCountry[normalizedCountry]);
        } else {
          console.log(`No places found for ${normalizedCountry}`);
          setPlaces([]);
        }
      }
    } catch (error) {
      setErrorMsg('Error fetching location details');
    }
  };

  return (
    <View style={styles.container}>
      {errorMsg ? (
        <Text style={styles.errorText}>{errorMsg}</Text>
      ) : location ? (
        <>
          <View style={styles.locationContainer}>
            {city && country ? (
              <Text style={styles.locationText}>
                Your Location: {city}, {country}
              </Text>
            ) : (
              <Text style={styles.locationText}>Fetching your location...</Text>
            )}
          </View>
          <Text style={styles.heading}>Places to Visit in {country}</Text>
          
          {/* Back Button */}
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}  // Navigates back to the previous screen
          >
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>

          <FlatList
            data={places}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.placeCard}>
                <Image
                  source={{ uri: 'https://via.placeholder.com/100x100.png' }} // Placeholder image for now
                  style={styles.placeImage}
                />
                <View style={styles.placeInfo}>
                  <Text style={styles.placeTitle}>{item}</Text>
                  <Text style={styles.placeDescription}>Explore {item} for an unforgettable experience.</Text>
                </View>
              </TouchableOpacity>
            )}
            keyExtractor={(item, index) => index.toString()}
          />
        </>
      ) : (
        <Text>Loading your location...</Text>
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
  locationContainer: {
    marginBottom: 20,
    backgroundColor: '#6372ff',
    padding: 10,
    borderRadius: 10,
  },
  locationText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  backButton: {
    marginBottom: 20,
    backgroundColor: '#ff6347',
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  backButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  placeCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    marginBottom: 15,
    borderRadius: 10,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  placeImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
  },
  placeInfo: {
    marginLeft: 15,
    justifyContent: 'center',
  },
  placeTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  placeDescription: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default FindPlacesScreen;
