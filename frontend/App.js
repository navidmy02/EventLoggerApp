import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import axios from 'axios';

export default function App() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [events, setEvents] = useState([]);

  const API_BASE = 'http://192.168.0.11/EventLoggerApp/backend'; // Change as needed

  const fetchEvents = async () => {
    try {
      const res = await axios.get(`${API_BASE}/get_events.php`);
      setEvents(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const submitEvent = async () => {
    if (!title || !description) return;

    try {
      const res = await axios.post(`${API_BASE}/add_event.php`, { title, description });
      if (res.data.status === 'success') {
        setTitle('');
        setDescription('');
        fetchEvents();
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.eventCard}>
      <Text style={styles.eventTitle}>{item.title}</Text>
      <Text style={styles.eventDescription}>{item.description}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>📘 Event Logger</Text>

      <View style={styles.form}>
        <Text style={styles.label}>Title</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter event title"
          value={title}
          onChangeText={setTitle}
        />

        <Text style={styles.label}>Description</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Enter event description"
          value={description}
          onChangeText={setDescription}
          multiline
        />

        <TouchableOpacity style={styles.button} onPress={submitEvent}>
          <Text style={styles.buttonText}>➕ Add Event</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.subheader}>📜 Past Events</Text>

      <FlatList
        data={events}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={<Text style={styles.noData}>No events yet</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 50,
    paddingHorizontal: 20,
    backgroundColor: '#f6f5f0',
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#222',
    textAlign: 'center',
    marginBottom: 20,
  },
  subheader: {
    fontSize: 22,
    fontWeight: '600',
    marginTop: 30,
    marginBottom: 10,
    color: '#333',
  },
  form: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 16,
    elevation: 2,
    marginBottom: 20,
  },
  label: {
    fontWeight: '600',
    marginBottom: 6,
    color: '#555',
  },
  input: {
    borderColor: '#ccc',
    borderWidth: 1,
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#fdfdfd',
    marginBottom: 15,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  button: {
    backgroundColor: '#007BFF',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  eventCard: {
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 10,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#007BFF',
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#222',
  },
  eventDescription: {
    marginTop: 4,
    color: '#555',
  },
  noData: {
    textAlign: 'center',
    marginTop: 20,
    color: '#888',
  },
});
