import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { Chess } from 'chess.js';
import Chessboard from 'react-native-chessboard';

const PGNAnalysisScreen: React.FC = () => {
    const [pgn, setPgn] = useState('');
    const [position, setPosition] = useState('start');
    const [moveIndex, setMoveIndex] = useState(0);
    const [moves, setMoves] = useState<string[]>([]);
    // Remove initial Chess instance from useState
    const [game, setGame] = useState<Chess | null>(null);

    // Initialize Chess in useEffect
    useEffect(() => {
        try {
            setGame(new Chess());
        } catch (error) {
            console.error('Error initializing chess:', error);
        }
    }, []);

    const analyzePGN = () => {
        if (!game) return;
        
        try {
            const newGame = new Chess();
            newGame.loadPgn(pgn);
            setGame(newGame);
            const history = newGame.history();
            setMoves(history);
            setMoveIndex(0);
            setPosition(newGame.fen());
        } catch (error) {
            console.error('Invalid PGN format:', error);
        }
    };

    const navigateMove = (forward: boolean) => {
        if (!game) return;

        try {
            const newGame = new Chess();
            newGame.loadPgn(pgn);
            
            const newIndex = forward 
                ? Math.min(moveIndex + 1, moves.length - 1)
                : Math.max(moveIndex - 1, 0);
            
            for (let i = 0; i <= newIndex; i++) {
                newGame.move(moves[i]);
            }
            
            setMoveIndex(newIndex);
            setPosition(newGame.fen());
        } catch (error) {
            console.error('Error navigating move:', error);
        }
    };

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                multiline
                placeholder="Paste PGN here..."
                value={pgn}
                onChangeText={setPgn}
            />
            <Button 
                title="Analyze PGN" 
                onPress={analyzePGN}
                disabled={!game} // Disable button if chess isn't initialized
            />
            
            <View style={styles.boardContainer}>
                <View style={styles.board}>
                    <Chessboard
                        fen={position}
                    />
                </View>
            </View>

            <View style={styles.controls}>
                <Button 
                    title="Previous" 
                    onPress={() => navigateMove(false)}
                    disabled={moveIndex === 0 || !game}
                />
                <Button 
                    title="Next" 
                    onPress={() => navigateMove(true)}
                    disabled={moveIndex === moves.length - 1 || !game}
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
    input: {
        backgroundColor: '#fff',
        padding: 10,
        borderRadius: 5,
        marginBottom: 16,
        height: 100,
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
});

export default PGNAnalysisScreen;