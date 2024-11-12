import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const GameHistory = () => {
    // This will eventually hold the history of games
    const games: string[] = []; // Replace with actual game data

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Game History</Text>
            {games.length === 0 ? (
                <Text style={styles.noGames}>No games played yet.</Text>
            ) : (
                games.map((game, index) => (
                    <Text key={index} style={styles.game}>
                        {game} {/* Display game details */}
                    </Text>
                ))
            )}
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
    noGames: {
        color: '#fff',
    },
    game: {
        color: '#fff',
        marginVertical: 5,
    },
});

export default GameHistory; 