import { ApolloProvider } from "@apollo/client";
import client from "./config/ApolloClient";
import { NavigationContainer } from "@react-navigation/native";
import StackNavigator from "./Navigators/StackNavigator";
import {  useEffect, useState } from "react";
import { AuthContext } from "./Context/AuthContext";
import * as SecureStore from 'expo-secure-store';
import { View,Text } from "react-native";


export default function App() {
  const [isSignedIn, setIsSignedIn] = useState(false)
  const[loading,setLoading] = useState(true)

  useEffect(() => {
    SecureStore.getItemAsync("access_token").then((result) => {
      // console.log(result);
      if(result){
        setIsSignedIn(true)
      }
    }).finally(()=> {
      setLoading(false)
    })
  },[])

  if(loading){
    return (
      <View style={{justifyContent:"center", alignItems: "center",flex: 1}}>
        <Text>
          Loading.....
        </Text>
      </View>
    )
  }

  return (
    <AuthContext.Provider value={{isSignedIn,setIsSignedIn}}>
    <ApolloProvider client={client}>
      <NavigationContainer>
        <StackNavigator/>
      </NavigationContainer>
    </ApolloProvider>
    </AuthContext.Provider>
  );
}
