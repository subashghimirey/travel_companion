import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { firestore } from '../firebaseConfig'; // Adjust the path as needed
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore'; 
import { useRouter } from 'expo-router';


type Note = {
  id: string;
  title: string;
  content: string;
  createdAt: number; // or Date, depending on how it's stored
};// Import useRouter for navigation

const NotesListScreen = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const router = useRouter(); // Initialize router

 useEffect(() => {
  const notesQuery = query(collection(firestore, 'notes'), orderBy('createdAt', 'desc'));
  const unsubscribe = onSnapshot(notesQuery, snapshot => {
    const fetchedNotes: Note[] = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        title: data.title || '', // Ensure default value if missing
        content: data.content || '',
        createdAt: data.createdAt || 0, // Adjust default based on your Firestore field
      };
    });
    setNotes(fetchedNotes);
  });

  return () => unsubscribe();
}, []);


  const handleAddNote = () => {
    router.push('/add-notes'); // Navigate to Add Notes screen
  };

  const handleGoBack = () => {
    router.push('/'); // Navigate back to the previous screen (e.g., Home)
  };

  const renderItem = ({ item }: any) => (
    <View style={styles.noteCard}>
      <Text style={styles.noteTitle}>{item.title}</Text>
      <Text style={styles.noteContent}>{item.content}</Text>
      <TouchableOpacity onPress={() => { /* View note details */ }}>
        <Text style={styles.viewButton}>View</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
        <Text style={styles.backButtonText}>Back</Text>
      </TouchableOpacity>

      <FlatList
        data={notes}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={<Text style={styles.emptyText}>No notes available</Text>}
      />

      <TouchableOpacity style={styles.addButton} onPress={handleAddNote}>
        <Text style={styles.addButtonText}>+ Add Note</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  backButton: {
    backgroundColor: '#E0E0E0',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
    alignSelf: 'flex-start',
  },
  backButtonText: {
    color: '#333',
    fontSize: 16,
  },
  noteCard: {
    backgroundColor: '#f9f9f9',
    padding: 15,
    marginVertical: 10,
    borderRadius: 8,
  },
  noteTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  noteContent: {
    fontSize: 14,
    color: '#555',
  },
  viewButton: {
    color: '#007BFF',
    marginTop: 10,
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#777',
  },
  addButton: {
    backgroundColor: '#007BFF',
    padding: 15,
    borderRadius: 50,
    position: 'absolute',
    bottom: 20,
    right: 20,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default NotesListScreen;
