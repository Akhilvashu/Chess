import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, Alert } from 'react-native';
import { Chess } from 'chess.js';
import Chessboard from 'react-native-chessboard';

const ComputerGame: React.FC = () => {
    const initialPosition = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
    
    const [game, setGame] = useState<Chess | null>(null);
    const [position, setPosition] = useState(initialPosition);
    const [playerColor, setPlayerColor] = useState<'w' | 'b'>('w');
    const [status, setStatus] = useState<string>('White to move');
    const [moves, setMoves] = useState<string[]>([]);
    const [moveIndex, setMoveIndex] = useState(-1);
    const [key, setKey] = useState(0);

    // Initialize chess game
    useEffect(() => {
        try {
            const newGame = new Chess();
            setGame(newGame);
            setPosition(newGame.fen());
        } catch (error) {
            console.error('Error initializing chess:', error);
            Alert.alert('Error', 'Failed to initialize chess engine');
        }
    }, [key]);

    const resetBoard = () => {
        try {
            setKey(prevKey => prevKey + 1);
        } catch (error) {
            console.error('Error resetting board:', error);
            Alert.alert('Error', 'Failed to reset the game');
        }
    };

    return (
        <View style={styles.container} key={`game-container-${key}`}>
            <Text style={styles.status}>{status}</Text>
            
            <View style={styles.boardContainer}>
                <View style={styles.board}>
                    <Chessboard
                        fen={position}
                        key={`board-${key}`}
                    />
                </View>
            </View>

            <View style={styles.controls}>
                <Button 
                    title="Reset Game"
                    onPress={resetBoard}
                    color="#ff6b6b"
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#313131',
    },
    boardContainer: {
        aspectRatio: 1,
        width: '100%',
        marginVertical: 20,
    },
    board: {
        flex: 1,
    },
    controls: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 16,
    },
    status: {
        color: '#fff',
        fontSize: 18,
        textAlign: 'center',
        marginBottom: 10,
    },
});

export default ComputerGame;
