import React, { useState } from "react";
import {
  View,
  Text,
  Button,
  Image,
  Modal,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useQuery, gql } from "@apollo/client";
import { ActivityIndicator } from "react-native";
import CommentForm from "../Components/CommentForm";

export const GET_POSTS_BY_ID = gql`
  query GetPostById($postId: ID) {
    getPostById(postId: $postId) {
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

export default function DetailsScreen({ navigation, route }) {
  const { _id } = route.params;
  const { loading, error, data } = useQuery(GET_POSTS_BY_ID, {
    variables: { postId: _id },
  });
  
  const [modalVisible, setModalVisible] = useState(false);

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
  // console.log({ loading, error, data }, "ini detail");

  return (
    <View style={{ flex: 1, justifyContent: "space-between" }}>
      <ScrollView>
        <View
          style={{
            height: 400,
            width: "100%",
            backgroundColor: "white",
            padding: 10,
            flexDirection: "column",
            borderRadius: 7,
            gap: 10,
            marginBottom: 10,
          }}
        >
          <Image
            style={{ width: "100%", height: "70%", borderRadius: 10 }}
            source={{
              uri: `${data.getPostById.imgUrl}`,
            }}
          />
          <Text>{data.getPostById.content}</Text>
          <Text>{data.getPostById.tags}</Text>
          <Text>{data.getPostById.author.username}</Text>
          <TouchableOpacity onPress={() => setModalVisible(true)}>
            <Text style={{ fontSize: 14 }}>Comments:</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      <CommentForm postId= {_id} />

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(0,0,0,0.5)",
          }}
        >
          <View
            style={{
              margin: 20,
              backgroundColor: "white",
              borderRadius: 20,
              padding: 35,
              alignItems: "center",
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.25,
              shadowRadius: 4,
              elevation: 5,
              width: "80%",
            }}
          >
            <Text
              style={{ marginBottom: 15, textAlign: "center", fontSize: 18 }}
            >
              Comments:
            </Text>
            <ScrollView style={{ width: "100%" }}>
              {data.getPostById.comments?.map((comment, index) => (
                <View
                  key={index}
                  style={{
                    marginBottom: 10,
                    padding: 10,
                    borderRadius: 5,
                  }}
                >
                  <Text style={{ fontWeight: "bold" }}>{comment.username}</Text>
                  <Text>{comment.content}</Text>
                </View>
              ))}
            </ScrollView>
            <Button
              onPress={() => setModalVisible(!modalVisible)}
              title="Close"
            />
          </View>
        </View>
      </Modal>
    </View>
  );
}
