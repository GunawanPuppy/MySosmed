import { gql, useMutation } from "@apollo/client";
import { useContext, useState } from "react";
import { Alert, Text, TextInput, View, TouchableOpacity } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const REGISTER = gql`
  mutation AddUser(
    $name: String
    $username: String
    $email: String
    $password: String
  ) {
    addUser(
      name: $name
      username: $username
      email: $email
      password: $password
    ) {
      _id
      name
      username
      email
      password
    }
  }
`;

export default function RegisterScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [uname, setUname] = useState("");
  const [handleRegister] = useMutation(REGISTER);
  const navigation = useNavigation();

  async function handleSubmit() {
    try {
      //email password dapet dari  // useStatenya
      const result = await handleRegister({
        variables: { 
            name,
            username : uname,
            email,
            password
         },
      });
    //   console.log(result);
      Alert.alert("Registration Successful!", "", [
        { text: "OK", onPress: () => navigation.navigate("Login") },
      ]);
    } catch (error) {
      Alert.alert(error.message);
    //   console.log(error.message);
    }
  }

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        gap: 20,
        padding: 50,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          width: "100%",
          justifyContent: "center",
        }}
      >
        <FontAwesome5
          name="instagram"
          size={24}
          color="black"
          marginRight={10}
        />
        <Text style={{ fontSize: 20, fontWeight: "700" }}>VerveGram</Text>
      </View>
      <TextInput
        placeholder="Email"
        style={{ borderWidth: 1, padding: 10, fontSize: 16 }}
        onChangeText={(val) => {
          setEmail(val);
        }}
        value={email}
      />
      <TextInput
        placeholder="Password"
        secureTextEntry={true}
        style={{ borderWidth: 1, padding: 10, fontSize: 16 }}
        onChangeText={(val) => {
          setPassword(val);
        }}
        value={password}
      />
      <TextInput
        placeholder="Name"
        style={{ borderWidth: 1, padding: 10, fontSize: 16 }}
        onChangeText={(val) => {
          setName(val);
        }}
        value={name}
      />
      <TextInput
        placeholder="Username"
        style={{ borderWidth: 1, padding: 10, fontSize: 16 }}
        onChangeText={(val) => {
          setUname(val);
        }}
        value={uname}
      />
      <TouchableOpacity
        onPress={handleSubmit}
        style={{ backgroundColor: "darkorange", padding: 10 }}
      >
        <View>
          <Text style={{ fontSize: 16, textAlign: "center" }}>Register</Text>
        </View>
      </TouchableOpacity>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "start",
          alignItems: "center",
          marginTop: 10,
          gap: 10,
        }}
      >
        <Text>Already have an account?</Text>
        <TouchableOpacity onPress={() => navigation.navigate("Login")}>
          <Text
            style={{
              fontSize: 16,
              textAlign: "center",
              textDecorationLine: "underline",
              color: "#000080",
            }}
          >
            Login
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
