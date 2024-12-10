import React, { useState } from "react";
import { View, Button, Image, FlatList, StyleSheet, Alert, TouchableOpacity, Text } from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import { useNavigation } from "@react-navigation/native"; // Import useNavigation

const CameraComponent = () => {
  const navigation = useNavigation(); // Access navigation prop
  const [photos, setPhotos] = useState<string[]>([]);

  const handleOpenCamera = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission Denied",
        "Camera access is required to take photos."
      );
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      savePhoto(result.assets[0].uri);
    }
  };

  const savePhoto = async (uri: string) => {
    try {
      const fileName = uri.split("/").pop();
      const localUri = `${FileSystem.documentDirectory}${fileName}`;

      await FileSystem.moveAsync({
        from: uri,
        to: localUri,
      });

      setPhotos((prevPhotos) => [...prevPhotos, localUri]);
    } catch (error) {
      Alert.alert("Error", "Failed to save photo.");
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backButtonText}>{"< Back"}</Text>
      </TouchableOpacity>

      <Button title="Open Camera" onPress={handleOpenCamera} />
      <FlatList
        data={photos}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <Image source={{ uri: item }} style={styles.photo} />
        )}
        contentContainerStyle={styles.photoList}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  backButton: {
    marginBottom: 20,
    padding: 10,
  },
  backButtonText: {
    fontSize: 18,
    color: "#007bff", // Customize the color as needed
  },
  photoList: {
    marginTop: 20,
  },
  photo: {
    width: 100,
    height: 100,
    margin: 10,
    borderRadius: 10,
  },
});

export default CameraComponent;
