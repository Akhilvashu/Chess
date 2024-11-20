import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

const GameModeScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Select Game Mode</Text>
            <View style={styles.buttonContainer}>
                <Button
                    title="vs Human"
                    onPress={() => navigation.navigate('Game')}
                />
                <View style={styles.buttonSpacing} />
                <Button
                    title="vs Computer"
                    onPress={() => navigation.navigate('ComputerGame')}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#313131',
    },
    title: {
        fontSize: 24,
        color: '#fff',
        marginBottom: 20,
    },
    buttonContainer: {
        width: '80%',
    },
    buttonSpacing: {
        height: 10,
    },
});

export default GameModeScreen;