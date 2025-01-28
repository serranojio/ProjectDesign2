import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from 'react-native-vector-icons';
import HomeScreen from './screens/HomeScreen';
import ProfileScreen from './screens/ProfileScreen';
import LoginScreen from './screens/LoginScreen';
import SignUpScreen from './screens/SignUpScreen';  
import { InferenceResultsProvider } from './contexts/InferenceResultsContext';
import { UserProvider } from './contexts/UserContext';
import NotificationScreen from './screens/NotificationScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function TabNavigator({ userEmail, setIsLoggedIn }) {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#15412D',
        tabBarInactiveTintColor: 'gray',
      }}
      initialRouteName="Home"
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          headerShown: true,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        options={{
          headerShown: true,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-circle-outline" size={size} color={color} />
          ),
        }}
        initialParams={{ userEmail }}  
        component={(props) => <ProfileScreen {...props} setIsLoggedIn={setIsLoggedIn} />}
      />
      <Tab.Screen
        name="Notification Logs"
        component={NotificationScreen}
        options={{
          headerShown: true,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="notifications-circle-outline" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

function MainStackNavigator({ isLoggedIn, setIsLoggedIn }) {
  const [userEmail, setUserEmail] = useState('');

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!isLoggedIn ? (
        <>
          <Stack.Screen name="Login">
            {(props) => (
              <LoginScreen
                {...props}
                onLogin={(email) => {
                  setIsLoggedIn(true);  
                  setUserEmail(email);  
                }}
              />
            )}
          </Stack.Screen>
          <Stack.Screen name="SignUp">
            {(props) => (
              <SignUpScreen
                {...props}
                onSignUp={(email) => {
                  setUserEmail(email);
                }}
              />
            )}
          </Stack.Screen>
        </>
      ) : (
        <Stack.Screen name="Main">
          {(props) => (
            <TabNavigator
              {...props}
              userEmail={userEmail}  
              setIsLoggedIn={setIsLoggedIn}  
            />
          )}
        </Stack.Screen>
      )}
    </Stack.Navigator>
  );
}

// Main App component
export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <UserProvider>
      <InferenceResultsProvider>
        <NavigationContainer>
          <MainStackNavigator
            isLoggedIn={isLoggedIn}
            setIsLoggedIn={setIsLoggedIn}  
          />
        </NavigationContainer>
      </InferenceResultsProvider>
    </UserProvider>
  );
}
