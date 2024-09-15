import { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StatusBar,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import Card from "../Components/Card";
import { useQuery, gql } from "@apollo/client";

export const GET_POSTS = gql`
  query GetPosts {
    getPosts {
      _id
      content
      tags
      imgUrl
      authorId
      author {
        username
      }
      comments {
        content
        username
      }
      likes {
        username
      }
      createdAt
      updatedAt
    }
  }
`;

export default function Home({ navigation }) {
  const { loading, error, data, refetch } = useQuery(GET_POSTS);

  // useEffect(() => {
  //   const unsubscribe = navigation.addListener("focus", () => {
  //     refetch();
  //   });
  //   return unsubscribe;
  // }, [navigation]);

  if (loading)
    return (
      <View style={{ justifyContent: "center", alignItems: "center", flex: 1 }}>
        <ActivityIndicator size="large" />
        <Text>Loading.... Boss Sabarrr</Text>
      </View>
    );
  if (error)
    return (
      <View style={{ justifyContent: "center", alignItems: "center", flex: 1 }}>
        <Text>{error.message}</Text>
      </View>
    );
  console.log({ loading, error, data }, "ini di Home");

  return (
    <View style={styles.container}>
      <StatusBar />
      <FlatList
        style={{ gap: 10, padding: 10 }}
        data={data?.getPosts.map((post) => ({
          ...post,
          comments: post.comments || "",
          likes: post.likes || "",
        }))}
        renderItem={({ item }) => <Card data={item} />}
        keyExtractor={(item) => item._id}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
    padding: 10,
    gap: 10,
  },
});
