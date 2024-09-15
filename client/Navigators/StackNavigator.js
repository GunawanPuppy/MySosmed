import LoginScreen from "../Screens/Login";
import DetailsScreen from "../Screens/Detail";
import MyTabs from "./TabNav";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Image } from "react-native";
import { useContext, useState } from "react";
import { AuthContext } from "../Context/AuthContext";
import RegisterScreen from "../Screens/Register";
import ProfileScreen from "../Screens/Profile";
import SearchScreen from "../Screens/Search";

const Stack = createNativeStackNavigator();

export default function stackNavigator() {
  const {isSignedIn} = useContext(AuthContext)

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: "#708090",
        },
        headerTitleStyle: {
          fontWeight: "bold",
        },
        headerRight: () => {
          return (
            <Image
              style={{ height: 40, width: 40 }}
              source={{
                uri: "https://down-bs-id.img.susercontent.com/9787ffcf620ea15ffb6e66136a55d752_tn.webp",
              }}
            />
          );
        },
      }}
    >
      {isSignedIn ? (
        <>
          <Stack.Screen
            name="Home"
            options={{
              title: "Verve",
            }}
            component={MyTabs}
          />
          <Stack.Screen name="Details" component={DetailsScreen} />
          <Stack.Screen name="Profile" component={ProfileScreen} />
          <Stack.Screen name="Search" component={SearchScreen} />
        </>
      ) : (
        <>
          <Stack.Screen
            name="Login"
            options={{
              headerShown: false,
            }}
            component={LoginScreen}
          />
           <Stack.Screen
            name="Register"
            options={{
              headerShown: false,
            }}
            component={RegisterScreen}
          />
        </>
      )}
    </Stack.Navigator>
  );
}
