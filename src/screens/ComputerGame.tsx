import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, Alert } from 'react-native';
import { Chess } from 'chess.js';
import Chessboard from 'react-native-chessboard';

const ComputerGame: React.FC = () => {
    const initialPosition = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
    
    const [game, setGame] = useState<Chess | null>(null);
    const [position, setPosition] = useState(initialPosition);
    const [playerColor, setPlayerColor] = useState<'w' | 'b'>('w');
    const [status, setStatus] = useState<string>('Choose your color');
    const [moves, setMoves] = useState<string[]>([]);
    const [moveIndex, setMoveIndex] = useState(-1);
    const [key, setKey] = useState(0);
    const [gameStarted, setGameStarted] = useState(false);

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

    const selectColor = (color: 'w' | 'b') => {
        setPlayerColor(color);
        setGameStarted(true);
        setStatus(color === 'w' ? 'White to move' : 'Black to move');
    };

    const resetBoard = () => {
        try {
            setKey(prevKey => prevKey + 1);
            setGameStarted(false);
            setStatus('Choose your color');
        } catch (error) {
            console.error('Error resetting board:', error);
            Alert.alert('Error', 'Failed to reset the game');
        }
    };

    return (
        <View style={styles.container} key={`game-container-${key}`}>
            <View style={styles.infoContainer}>
                <View style={styles.playerInfo}>
                    <Text style={styles.playerLabel}>Bot</Text>
                    <View style={[styles.colorIndicator, { backgroundColor: playerColor === 'w' ? '#000' : '#fff' }]} />
                </View>
            </View>

            <View style={styles.boardContainer}>
                <View style={styles.board}>
                    <Chessboard
                        fen={position}
                        key={`board-${key}`}
                    />
                </View>
            </View>

            <View style={styles.bottomContainer}>
                <View style={styles.infoContainer}>
                    <View style={styles.playerInfo}>
                        <Text style={styles.playerLabel}>Player</Text>
                        <View style={[styles.colorIndicator, { backgroundColor: playerColor === 'w' ? '#fff' : '#000' }]} />
                    </View>
                </View>

                <View style={styles.controls}>
                    <Button 
                        title="Reset Game"
                        onPress={resetBoard}
                        color="#ff6b6b"
                    />
                </View>

                <View style={styles.colorSelection}>
                    <Button 
                        title="Play as White" 
                        onPress={() => selectColor('w')}
                        color="#fff"
                    />
                    <View style={styles.buttonSpacer} />
                    <Button 
                        title="Play as Black" 
                        onPress={() => selectColor('b')}
                        color="#000"
                    />
                </View>
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
    infoContainer: {
        padding: 10,
        backgroundColor: '#424242',
        borderRadius: 8,
        marginVertical: 19,
    },
    playerInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
    },
    playerLabel: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    colorIndicator: {
        width: 20,
        height: 20,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#666',
    },
    boardContainer: {
        aspectRatio: 1,
        width: '100%',
        alignSelf: 'center',
        marginBottom: 25,
    },
    board: {
        flex: 1,
    },
    bottomContainer: {
        marginBottom: 10,
    },
    controls: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 12,
        paddingHorizontal: 20,
    },
    status: {
        color: '#fff',
        fontSize: 24,
        textAlign: 'center',
        marginTop: 20,
    },
    colorSelection: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
        padding: 20,
    },
    buttonSpacer: {
        width: 20,
    },
});

export default ComputerGame;
