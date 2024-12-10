import React, { useState } from "react";
import {
  View,
  Text,
  Button,
  Image,
  FlatList,
  Alert,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import { useNavigation } from "@react-navigation/native"; // Import useNavigation

const MultiImagePicker = () => {
  const navigation = useNavigation(); // Access navigation prop
  const [images, setImages] = useState<string[]>([]);

  const handleSelectImages = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission Denied",
        "Gallery access is required to select photos."
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      selectionLimit: 5, // Limit to 5 images
      quality: 1,
    });

    if (!result.canceled && result.assets) {
      const selectedUris = result.assets.map((asset) => asset.uri);

      if (selectedUris.length > 5) {
        Alert.alert("Limit Exceeded", "You can only select up to 5 images.");
        return;
      }

      selectedUris.forEach(saveImage);
    }
  };

  const saveImage = async (uri: string) => {
    try {
      const fileName = uri.split("/").pop();
      const localUri = `${FileSystem.documentDirectory}${fileName}`;
      await FileSystem.copyAsync({
        from: uri,
        to: localUri,
      });
      setImages((prevImages) => [...prevImages, localUri]);
    } catch (error) {
      Alert.alert("Error", "Failed to save image.");
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backButtonText}>{"< Back"}</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Select Images</Text>
      <TouchableOpacity style={styles.button} onPress={handleSelectImages}>
        <Text style={styles.buttonText}>Choose Images</Text>
      </TouchableOpacity>

      {images.length === 0 ? (
        <Text style={styles.emptyText}>
          No images selected yet. Pick up to 5!
        </Text>
      ) : (
        <FlatList
          data={images}
          keyExtractor={(item, index) => index.toString()}
          numColumns={3}
          renderItem={({ item }) => (
            <View style={styles.imageContainer}>
              <Image source={{ uri: item }} style={styles.image} />
            </View>
          )}
          contentContainerStyle={styles.imageList}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f4f4",
    padding: 16,
  },
  backButton: {
    marginBottom: 20,
    padding: 10,
  },
  backButtonText: {
    fontSize: 18,
    color: "#007bff", // Customize the color as needed
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 16,
    textAlign: "center",
  },
  button: {
    backgroundColor: "#28a745",
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  imageList: {
    justifyContent: "space-between",
  },
  imageContainer: {
    flex: 1,
    margin: 8,
    borderRadius: 10,
    overflow: "hidden",
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  image: {
    width: "100%",
    height: 100,
    resizeMode: "cover",
  },
  emptyText: {
    color: "#999",
    fontSize: 16,
    textAlign: "center",
    marginTop: 20,
  },
});

export default MultiImagePicker;
