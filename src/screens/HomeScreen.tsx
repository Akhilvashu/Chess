import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

const HomeScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Chess Game</Text>
            <Button
                title="Play"
                onPress={() => navigation.navigate('Game')}
            />
            <Button
                title="Game History"
                onPress={() => navigation.navigate('GameHistory')}
            />
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
        fontSize: 32,
        color: '#fff',
        marginBottom: 20,
    },
});

export default HomeScreen; 