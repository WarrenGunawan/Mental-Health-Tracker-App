import { useState } from "react";

import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import LoginPage from "./Screens/Authenticate/LoginPage";
import SignUpPage from "./Screens/Authenticate/SignUpPage";
import AvatarPage from "./Screens/MainScreens/AvatarPage";

// eslint-disable-next-line import/no-unresolved
import EntryList from "./Screens/MainScreens/EntryList";

const Stack = createNativeStackNavigator();


export default function App() {

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}> 
        <Stack.Screen name='login' component={LoginPage} ></Stack.Screen>
        <Stack.Screen name='signup' component={SignUpPage} ></Stack.Screen>

        <Stack.Screen name='avatarpage' component={AvatarPage} ></Stack.Screen>
        <Stack.Screen name='entrylist' component={EntryList} options={{ animation: 'slide_from_left' }}></Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}