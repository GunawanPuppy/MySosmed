import { useState, useContext } from "react";
import { useNavigation } from "@react-navigation/native";
import {
  Alert,
  Button,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { gql, useMutation } from "@apollo/client";
import { AuthContext } from "../Context/AuthContext";
import { Ionicons } from "@expo/vector-icons";


const LIKE_POST = gql`
  mutation LikePost($postId: ID) {
    likePost(PostId: $postId) {
      message
    }
  }
`;

export default function Card({ data }) {
  const navigation = useNavigation();
  const { isSignedIn } = useContext(AuthContext);
  const [likes, setLikes] = useState(data.likes.length);
  const [hasLiked, setHasLiked] = useState(false);
  const [likePost] = useMutation(LIKE_POST);

  const handleLike = async () => {
    if (!isSignedIn) {
      Alert.alert("Please log in to like posts.");
      return;
    }
    if (hasLiked) {
      Alert.alert("You have already liked this post.");
      return;
    }
    try {
      const result = await likePost({ variables: { postId: data._id } });
      if (result.data.likePost.message === "Success") {
        setLikes(likes + 1);
        setHasLiked(true);
      } else {
        Alert.alert(result.data.likePost.message);
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error liking the post.");
    }
  };

  return (
    <View style={styles.cardContainer}>
      <Image
        style={styles.image}
        source={{
          uri: `${data.imgUrl}`,
        }}
      />
      <TouchableOpacity style={styles.likeButton} onPress={handleLike}>
        <Ionicons name="heart-outline" size={24} color="black" />
      </TouchableOpacity>
      <View style={styles.contentContainer}>
        <Text style={styles.username}>{data.author.username}</Text>
        <Text style={styles.content}>{data.content}</Text>
        <Text style={styles.tags}>{data.tags.join(", ")}</Text>
        <View style={styles.commentLikeContainer}>
          <Text style={styles.commentLikeText}>
            Comments: {data.comments.length}
          </Text>
          <Text style={styles.commentLikeText}>Likes: {likes}</Text>
        </View>
        <Button
          title="See Details"
          onPress={() => navigation.navigate("Details", {_id : data._id})}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: "#f3f3f3",
    padding: 10,
    borderRadius: 7,
    marginBottom: 10,
  },
  image: {
    width: "100%",
    height: 200,
    borderRadius: 10,
  },
  likeButton: {
    alignItems: "flex-end",
    padding: 5,
  },
  contentContainer: {
    backgroundColor: "#f3f3f3",
    marginTop: 10, // Added marginTop to avoid overlap with the image
  },
  username: {
    fontSize: 12,
    fontWeight: "bold",
    marginBottom: 5,
  },
  content: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  tags: {
    fontSize: 12,
    color: "#888",
    marginBottom: 5,
  },
  commentLikeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  commentLikeText: {
    fontSize: 10,
  },
});
