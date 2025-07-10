import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, Button, FlatList, ActivityIndicator, Alert } from 'react-native';

const API_BASE = 'http://YOUR_API_URL'; // <-- Replace with your PHP backend URL

export default function App() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch events from backend
  const fetchEvents = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/get_events.php`);
      const data = await res.json();
      setEvents(data);
    } catch (e) {
      Alert.alert('Error', 'Could not fetch events');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  // Submit new event
  const submitEvent = async () => {
    if (!title.trim() || !description.trim()) {
      Alert.alert('Validation', 'Please enter both title and description');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/add_event.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description }),
      });
      const result = await res.json();
      if (result.status === 'success') {
        setTitle('');
        setDescription('');
        fetchEvents();
      } else {
        Alert.alert('Error', 'Failed to add event');
      }
    } catch (e) {
      Alert.alert('Error', 'Could not submit event');
    }
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Event Logger</Text>
      <TextInput
        style={styles.input}
        placeholder="Title"
        value={title}
        onChangeText={setTitle}
      />
      <TextInput
        style={[styles.input, styles.textarea]}
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
        multiline
        numberOfLines={3}
      />
      <Button title="Submit Event" onPress={submitEvent} disabled={loading} />
      <Text style={styles.subheading}>Past Events</Text>
      {loading ? (
        <ActivityIndicator size="large" />
      ) : (
        <FlatList
          data={events}
          keyExtractor={item => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.eventItem}>
              <Text style={styles.eventTitle}>{item.title}</Text>
              <Text style={styles.eventDesc}>{item.description}</Text>
            </View>
          )}
          ListEmptyComponent={<Text>No events found.</Text>}
        />
      )}
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
    paddingTop: 50,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  subheading: {
    fontSize: 18,
    marginVertical: 16,
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1,
    borderColor: '#aaa',
    borderRadius: 6,
    padding: 10,
    marginBottom: 12,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  textarea: {
    height: 70,
    textAlignVertical: 'top',
  },
  eventItem: {
    backgroundColor: '#f1f1f1',
    padding: 12,
    borderRadius: 6,
    marginBottom: 10,
  },
  eventTitle: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  eventDesc: {
    fontSize: 14,
    color: '#333',
    marginTop: 4,
  },
});
