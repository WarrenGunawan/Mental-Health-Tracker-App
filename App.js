import { useState } from 'react';

import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import LoginPage from './Screens/Authenticate/LoginPage';
import SignUpPage from './Screens/Authenticate/SignUpPage';
import MonthlyList from './Screens/MainScreens/MonthlyList';
import EntryList from './Screens/MainScreens/EntryList';
import FriendsPage from './Screens/MainScreens/FriendsPage'
import AvatarPage from './Screens/MainScreens/AvatarPage';
import ProfilePage from './Screens/MainScreens/ProfilePage';




import { AuthProvider, useAuth } from './AuthContext';


import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';


const Stack = createNativeStackNavigator();

const Tab = createBottomTabNavigator();

function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name='login' component={LoginPage} ></Stack.Screen>
      <Stack.Screen name='signup' component={SignUpPage} ></Stack.Screen>
    </Stack.Navigator>
  )
}

function AppTabs() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }} initialRouteName={'avatarpage'}>
      <Tab.Screen name='monthlylist' 
        component={MonthlyList}
        options={{
          tabBarShowLabel: false,
          tabBarIcon: ({ focused }) => {
            return(
              <MaterialCommunityIcons
                name={focused ? 'calendar-month' : 'calendar-month-outline'} 
                size={30} 
                color={'black'} />
            )
          },
        }} />
      <Tab.Screen name='entrylist' 
        component={EntryList}
        options={{
          tabBarShowLabel: false,
          tabBarIcon: ({ focused }) => {
            return(
              <MaterialCommunityIcons
                name={focused ? 'list-box' : 'list-box-outline'} 
                size={30} 
                color={'black'} />
            )
          },
        }} />
      <Tab.Screen name='avatarpage' 
        component={AvatarPage} 
        options={{
          tabBarShowLabel: false,
          tabBarIcon: ({ focused, size }) => {
            return(
              <MaterialCommunityIcons
                name={focused ? 'home' : 'home-outline'} 
                size={30} 
                color={'black'} />
            )
          },
        }}
         />
      <Tab.Screen name='friendspage' 
        component={FriendsPage} 
        options={{
          tabBarShowLabel: false,
          tabBarIcon: ({ focused, size }) => {
            return(
              <MaterialCommunityIcons
                name={focused ? 'account-group' : 'account-group-outline'} 
                size={30} 
                color={'black'} />
            )
          },
        }}
      />
      <Tab.Screen name='profilepage' 
        component={ProfilePage} 
        options={{
          tabBarShowLabel: false,
          tabBarIcon: ({ focused, size }) => {
            return(
              <MaterialCommunityIcons
                name={focused ? 'emoticon-cool' : 'emoticon-cool-outline'} 
                size={30} 
                color={'black'} />
            )
          },
        }}
      />
    </Tab.Navigator>
  )
}

function RootNavigator() {
  const { user, authReady } = useAuth();

  if (!authReady) return null; 

  return user ? <AppTabs /> : <AuthStack />;
}


const AppTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: 'white', 
  },
};

xj
export default function App() {

  return (
    <AuthProvider>
      <NavigationContainer theme={AppTheme}>
        <RootNavigator/>
      </NavigationContainer>
    </AuthProvider>
  );
}