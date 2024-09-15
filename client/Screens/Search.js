import React, { useState } from "react";
import { View, Text, Button, TextInput, FlatList } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useLazyQuery, gql } from "@apollo/client";

const GET_USER_BY_USERNAME = gql`
  query GetUsersByUsername($username: String!) {
    getUsersByUsername(username: $username) {
      username
    }
  }
`;

export default function SearchScreen() {
  const navigation = useNavigation();
  const [username, setUsername] = useState("");
  const [searchUser, { loading, error, data }] = useLazyQuery(GET_USER_BY_USERNAME);

  const handleSearch = () => {
    searchUser({ variables: { username } });
  };

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text>Search Screen</Text>
      <TextInput
        style={{
          height: 40,
          borderColor: "gray",
          borderWidth: 1,
          width: "80%",
          paddingHorizontal: 10,
          marginBottom: 20,
        }}
        placeholder="Enter username"
        value={username}
        onChangeText={setUsername}
      />
      <Button title="Search" onPress={handleSearch} />
      <Button title="Go to Home" onPress={() => navigation.goBack()} />

      {loading && <Text>Loading...</Text>}
      {error && <Text>Error: {error.message}</Text>}

      {data && (
        <FlatList
          data={data.getUsersByUsername}
          keyExtractor={(item) => item.username}
          renderItem={({ item }) => (
            <View style={{ padding: 10 }}>
              <Text>{item.username}</Text>
            </View>
          )}
        />
      )}
    </View>
  );
}
