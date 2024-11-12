import React from 'react';
import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './src/screens/HomeScreen';
import Game from './src/screens/Game'; // Your existing game component
import GameHistory from './src/screens/GameHistory'; // New GameHistory component

const Stack = createStackNavigator();

function App(): JSX.Element {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Home">
                <Stack.Screen name="Home" component={HomeScreen} />
                <Stack.Screen name="Game" component={Game} />
                <Stack.Screen name="GameHistory" component={GameHistory} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}

export default App;
