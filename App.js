import { useState } from "react";

import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import LoginPage from "./Screens/Authenticate/LoginPage";
import SignUpPage from "./Screens/Authenticate/SignUpPage";
import AvatarPage from "./Screens/MainScreens/AvatarPage";

// eslint-disable-next-line import/no-unresolved
import EntryList from "./Screens/MainScreens/EntryList";

import { AuthProvider, useAuth } from "./AuthContext";


const Stack = createNativeStackNavigator();

function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name='login' component={LoginPage} ></Stack.Screen>
      <Stack.Screen name='signup' component={SignUpPage} ></Stack.Screen>
    </Stack.Navigator>
  )
}

function AppStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name='avatarpage' component={AvatarPage} ></Stack.Screen>
      <Stack.Screen name='entrylist' component={EntryList} options={{ animation: 'slide_from_left' }}></Stack.Screen>
    </Stack.Navigator>
  )
}

function RootNavigator() {
  const { user, authReady } = useAuth();

  if (!authReady) return null; 

  return user ? <AppStack /> : <AuthStack />;
}


export default function App() {

  return (
    <AuthProvider>
      <NavigationContainer>
        <RootNavigator/>
      </NavigationContainer>
    </AuthProvider>
  );
}