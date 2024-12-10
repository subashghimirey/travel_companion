import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { firestore } from '../firebaseConfig'; // Adjust path if needed
import { collection, addDoc, serverTimestamp, setDoc, doc } from 'firebase/firestore'; 
import { useRouter } from 'expo-router';


const WriteNotesScreen = ({ navigation }:any) => {

    
const router = useRouter();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  // Handle saving the note to Firestore
  const handleSaveNote = async () => {
  if (title.trim() === '' || content.trim() === '') {
    Alert.alert('Validation Error', 'Please enter both title and content');
    return;
  }

  try {
    // Generate a document ID based on the title
    const docId = title.replace(/\s+/g, '_').toLowerCase(); // Replace spaces with underscores and make it lowercase

    // Add the note to Firestore with the custom document ID
    await setDoc(doc(firestore, 'notes', docId), {
      title,
      content,
      createdAt: serverTimestamp(), // Add timestamp for sorting
    });

    // After saving, navigate back to the NotesList screen
    router.push('/list-notes');
  } catch (error) {
    console.error("Error adding note: ", error);
    Alert.alert('Error', 'Failed to save the note. Please try again.');
  }
};

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Write a Note</Text>

      <TextInput
        style={styles.input}
        placeholder="Title"
        value={title}
        onChangeText={setTitle}
      />

      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Content"
        value={content}
        onChangeText={setContent}
        multiline
      />

      <TouchableOpacity style={styles.saveButton} onPress={handleSaveNote}>
        <Text style={styles.saveButtonText}>Save Note</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 15,
    paddingLeft: 10,
    fontSize: 16,
  },
  textArea: {
    height: 150,
    textAlignVertical: 'top',
  },
  saveButton: {
    backgroundColor: '#007BFF',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default WriteNotesScreen;
