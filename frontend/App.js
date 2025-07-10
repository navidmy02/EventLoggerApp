import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet } from 'react-native';
import axios from 'axios';

export default function App() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [events, setEvents] = useState([]);

  const API_BASE = 'http://192.168.0.11/EventLoggerApp/backend';

  const fetchEvents = async () => {
    try {
      const res = await axios.get(`${API_BASE}/get_events.php`);
      setEvents(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const submitEvent = async () => {
    try {
      const res = await axios.post(`${API_BASE}/add_event.php`, {
        title,
        description,
      });
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

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Add Event</Text>
      <TextInput
        style={styles.input}
        placeholder="Title"
        value={title}
        onChangeText={setTitle}
      />
      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
        multiline
        numberOfLines={4}
      />
      <Button title="Submit" onPress={submitEvent} />

      <Text style={styles.heading}>Event Logs</Text>
      <FlatList
        data={events}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.eventItem}>
            <Text style={styles.eventTitle}>{item.title}</Text>
            <Text>{item.description}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, paddingTop: 50 },
  heading: { fontSize: 20, marginVertical: 10, fontWeight: 'bold' },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 10, marginBottom: 10 },
  textArea: { height: 80 },
  eventItem: { marginVertical: 10, padding: 10, backgroundColor: '#eee' },
  eventTitle: { fontWeight: 'bold' },
});
