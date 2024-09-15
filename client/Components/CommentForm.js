import React, { useState } from "react";
import { View, TextInput, TouchableOpacity, Alert } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { gql, useMutation } from "@apollo/client";
import { GET_POSTS_BY_ID } from "./GraphQlQuery";

const ADD_COMMENT = gql`
  mutation AddComments($content: String, $postId: ID) {
    addComments(content: $content, PostId: $postId) {
      message
    }
  }
`;

export default function CommentForm({ postId }) {
  const [comment, setComment] = useState("");
  const [addComment, { data, loading, error }] = useMutation(ADD_COMMENT, {
    refetchQueries: [
      {
        query: GET_POSTS_BY_ID,
        variables: {
          postId: postId,
        },
      },
    ],
  });
  console.log(postId, "ini postId");
  //di hit pas button dipencet ngetrigger handleSubmit

  const handleSubmit = async () => {
    try {
      const result = await addComment({
        variables: { content: comment, postId },
      });
      
      Alert.alert("Success Add Comment");
      setComment("")
      console.log(result, "ini result");
    } catch (error) {
      console.log(error, "ini error handleComment");
    }
  };

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        padding: 10,
        borderTopWidth: 1,
        borderColor: "#ddd",
      }}
    >
      <TextInput
        style={{
          flex: 1,
          height: 40,
          borderColor: "gray",
          borderWidth: 1,
          borderRadius: 5,
          paddingHorizontal: 10,
          marginRight: 10,
        }}
        placeholder="Add a comment..."
        value={comment}
        onChangeText={setComment}
      />
      <TouchableOpacity
        onPress={() => {
          handleSubmit();
        }}
      >
        <Icon name="send" size={24} color="blue" />
      </TouchableOpacity>
    </View>
  );
}
