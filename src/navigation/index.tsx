import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen'; 
import Game from '../screens/Game';
import GameHistory from '../screens/GameHistory';
import PGNAnalysisScreen from '../screens/PGNAnalysisScreen';

const Stack = createNativeStackNavigator();

export default function Navigation() {
  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName="Home"
        screenOptions={{
          headerStyle: {
            backgroundColor: '#313131',
          },
          headerTintColor: '#fff',
        }}
      >
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Game" component={Game} />
        <Stack.Screen name="GameHistory" component={GameHistory} />
        <Stack.Screen 
          name="PGNAnalysis" 
          component={PGNAnalysisScreen}
          options={{ title: 'PGN Analysis' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}