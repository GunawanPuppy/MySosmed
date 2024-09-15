import { gql, useMutation } from "@apollo/client";
import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  Alert,
  TouchableOpacity,
} from "react-native";
import { StyleSheet } from "react-native";

const ADD_POST = gql`
  mutation AddPosts($content: String, $tags: [String], $imgUrl: String) {
    addPosts(content: $content, tags: $tags, imgUrl: $imgUrl) {
      message
    }
  }
`;

export default function AddScreen() {
  const navigation = useNavigation();
  const [content, setContent] = useState("");
  const [tags, setTags] = useState([]);
  const [imgUrl, setImgUrl] = useState("");
  const [handlePost] = useMutation(ADD_POST);

  const handleSubmit = async () => {
    try {
      const result = await handlePost({
        variables: {
          content,
          tags,
          imgUrl,
        },
      });
      console.log(result, "ini result posting");
      Alert.alert(
        "Posting Has Been Successful!",
        "",
        [
          {
            text: "OK",
            onPress: () => navigation.navigate("Homes"),
          },
        ]
      );
    } catch (error) {
      Alert.alert(error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text>Add Posts Screen</Text>

      <TextInput
        style={styles.inputField}
        multiline={true}
        numberOfLines={4}
        placeholder="Write your post content..."
        value={content}
        onChangeText={setContent}
      />
      <TextInput
        style={styles.inputField}
        placeholder="Enter tags separated by commas (e.g., nature, travel)"
        value={tags.join(", ")} // Convert tags array to comma-separated string
        onChangeText={(text) => setTags(text.split(", "))} // Split back into array on change
      />
      <TextInput
        style={styles.inputField}
        placeholder="Enter image URL (optional)"
        value={imgUrl}
        onChangeText={setImgUrl}
      />
      <TouchableOpacity
        onPress={handleSubmit}
        style={{ backgroundColor: "lightblue", padding: 10 }}
      >
        <Text style={{ fontSize: 16, textAlign: "center" }}>Submit Post</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  inputField: {
    marginBottom: 10,
    padding: 10,
    fontSize: 16,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#ddd",
  },
});
