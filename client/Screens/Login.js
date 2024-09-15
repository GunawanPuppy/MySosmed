import { gql, useMutation } from "@apollo/client";
import { useContext, useState } from "react";
import { Alert, Text, TextInput, View, TouchableOpacity, ImageBackground, StyleSheet } from "react-native";
import { AuthContext } from "../Context/AuthContext";
import * as SecureStore from "expo-secure-store";
import { FontAwesome5 } from "@expo/vector-icons";


const LOGIN = gql`
  mutation Login($email: String, $password: String) {
    login(email: $email, password: $password) {
      access_token
    }
  }
`;

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [handleLogin] = useMutation(LOGIN);
  const { setIsSignedIn } = useContext(AuthContext);

  async function handleSubmit() {
    try {
      const result = await handleLogin({ variables: { email, password } });
      setIsSignedIn(true);
      console.log(result);
      await SecureStore.setItemAsync(
        "access_token",
        result?.data.login.access_token
      );
    } catch (error) {
      Alert.alert(error.message);
      console.log(error.message);
    }
  }

  return (
    <ImageBackground
      source={{ uri: 'https://down-bs-id.img.susercontent.com/9787ffcf620ea15ffb6e66136a55d752_tn.webp' }}
      style={styles.background}
      imageStyle={styles.backgroundImage}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.header}>
            <FontAwesome5
              name="instagram"
              size={24}
              color="white"
              style={{ marginRight: 10 }}
            />
            <Text style={styles.title}>VerveGram</Text>
          </View>

          <TextInput
            placeholder="Email"
            style={styles.input}
            onChangeText={(val) => setEmail(val)}
            value={email}
          />
          <TextInput
            placeholder="Password"
            secureTextEntry={true}
            style={styles.input}
            onChangeText={(val) => setPassword(val)}
            value={password}
          />
          <TouchableOpacity
            onPress={handleSubmit}
            style={styles.loginButton}
          >
            <View>
              <Text style={styles.loginButtonText}>Login</Text>
            </View>
          </TouchableOpacity>

          <View style={styles.registerContainer}>
            <Text style={styles.registerText}>Don't you have an account?</Text>
            <TouchableOpacity onPress={() => navigation.navigate("Register")}>
              <Text style={styles.registerLink}>Register</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'center',
  },
  backgroundImage: {
    resizeMode: 'cover',
    opacity: 1, // To ensure the background image does not dominate
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)', // Semi-transparent black overlay
    justifyContent: 'center',
  },
  container: {
    padding: 20,
    margin: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)', // Semi-transparent white background for the form
    borderRadius: 10,
  },
  header: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: 'white',
  },
  input: {
    borderWidth: 1,
    padding: 10,
    fontSize: 16,
    backgroundColor: 'white', // Background color to make the text input more readable
    marginBottom: 10,
    borderRadius: 5,
  },
  loginButton: {
    backgroundColor: "darkorange",
    padding: 10,
    borderRadius: 5,
  },
  loginButtonText: {
    fontSize: 16,
    textAlign: "center",
    color: 'white',
  },
  registerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    gap: 10,
  },
  registerText: {
    fontSize: 16,
    color: 'white',
  },
  registerLink: {
    fontSize: 16,
    textDecorationLine: "underline",
    color: "#000080",
  },
});
