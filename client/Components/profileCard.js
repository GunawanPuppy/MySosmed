import React from 'react';
import { View, Text } from 'react-native';

export default function ProfileCard({ name, username, email }) {
  return (
    <View style={{ padding: 20, borderWidth: 1, borderColor: '#ddd', borderRadius: 5, margin: 10 }}>
      <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Profile Information</Text>
      <Text>Name: {name}</Text>
      <Text>Username: {username}</Text>
      <Text>Email: {email}</Text>
    </View>
  );
}
