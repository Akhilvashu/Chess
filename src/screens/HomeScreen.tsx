import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

const HomeScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Chess Game</Text>
            <View style={styles.buttonContainer}>
                <Button
                    title="Play"
                    onPress={() => navigation.navigate('Game')}
                />
                <View style={styles.buttonSpacing} />
                <Button
                    title="Game History"
                    onPress={() => navigation.navigate('GameHistory')}
                />
                <View style={styles.buttonSpacing} />
                <Button
                    title="PGN Analysis"
                    onPress={() => navigation.navigate('PGNAnalysis')}  
                    />
            </View>
            <View style={styles.buttonSpacing} />
                <Button
                    title="AI Analysis"
                    onPress={() => navigation.navigate('AIAnalysis')}  
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
    buttonContainer: {
        width: '80%',  // Add this
    },
    buttonSpacing: {
        height: 10,  // Add this
    },
});
export default HomeScreen;  // Add this line if using default export