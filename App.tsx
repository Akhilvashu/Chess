import React from 'react';
import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './src/screens/HomeScreen';
import Game from './src/screens/Game';
import GameHistory from './src/screens/GameHistory';
import PGNAnalysisScreen from './src/screens/PGNAnalysisScreen';
import AIAnalysisScreen from './src/screens/AIAnalysisScreen';
import GameModeScreen from './src/screens/GameModeScreen';
import ComputerGame from './src/screens/ComputerGame';

const Stack = createStackNavigator();

function App(): JSX.Element {
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
                <Stack.Screen 
                    name="GameMode" 
                    component={GameModeScreen}
                    options={{ title: 'Select Mode' }}
                />
                <Stack.Screen name="Game" component={Game} />
                <Stack.Screen 
                    name="ComputerGame" 
                    component={ComputerGame}
                    options={{ title: 'vs Computer' }}
                />
                <Stack.Screen name="GameHistory" component={GameHistory} />
                <Stack.Screen 
                    name="PGNAnalysis" 
                    component={PGNAnalysisScreen}
                    options={{ title: 'PGN Analysis' }}
                />
                <Stack.Screen 
                    name="AIAnalysis" 
                    component={AIAnalysisScreen}
                    options={{ title: 'Stockfish Analysis' }}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
}

export default App;