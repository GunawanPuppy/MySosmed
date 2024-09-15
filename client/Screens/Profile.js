import React, { useContext, useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { View, Text, Button } from "react-native";
import { AuthContext } from "../Context/AuthContext";
import * as SecureStore from 'expo-secure-store';
import { useQuery, gql } from "@apollo/client";
import ProfileCard from "../Components/profileCard"; // Import ProfileCard component

const GET_USER_BY_ID = gql`
query GetUserById($id: ID) {
  getUserById(_id: $id) {
    _id
    name
    username
    email
  }
}
`

export default function ProfileScreen() {
  const { setIsSignedIn } = useContext(AuthContext);
  const navigation = useNavigation();
 

  const { loading, error, data } = useQuery(GET_USER_BY_ID, {
    variables: { _id:`667db83f7c2243433ec57f29`  },
    // Skip the query if userId is not available
  });
  console.log({data});

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text>Profile Screen</Text>

      {loading && <Text>Loading...</Text>}
      {error && <Text>Error: {error.message}</Text>}
      {data && data.getUserById && (
        <ProfileCard 
          name={data.getUserById.name}
          username={data.getUserById.username}
          email={data.getUserById.email}
        />
      )}

      <Button
        title="Logout"
        onPress={async () => {
          setIsSignedIn(false);
          await SecureStore.deleteItemAsync("access_token");
          navigation.navigate("Login"); // Navigate to Login screen
        }}
      />
    </View>
  );
}
