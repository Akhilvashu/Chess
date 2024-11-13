import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { Chess } from 'chess.js';
import Chessboard from 'react-native-chessboard';

const PGNAnalysisScreen: React.FC = () => {
    const [pgn, setPgn] = useState('');
    const [position, setPosition] = useState('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1');
    const [moveIndex, setMoveIndex] = useState(0);
    const [moves, setMoves] = useState<string[]>([]);
    const [game, setGame] = useState<Chess | null>(null);

    useEffect(() => {
        try {
            setGame(new Chess());
        } catch (error) {
            console.error('Error initializing chess:', error);
            Alert.alert('Error', 'Failed to initialize chess engine');
        }
    }, []);

    
        const analyzePGN = () => {
            if (!game) return;
            try {
                game.loadPgn(pgn);
                const history = game.history();
                
                // Reset to initial position
                game.reset();
                setMoves(history);
                setMoveIndex(-1);
                setPosition(game.fen());
                
                Alert.alert('Success', `Loaded ${history.length} moves`);
            } catch (error) {
                console.error('Invalid PGN format:', error);
                Alert.alert('Error', 'Invalid PGN format. Please check your input.');
            }
        };
    
        const navigateMove = (forward: boolean) => {
            if (!moves.length) return;
    
            const newIndex = forward 
                ? moveIndex + 1
                : moveIndex - 1;
    
            // Check bounds
            if (newIndex < -1 || newIndex >= moves.length) return;
    
            // Reset game to starting position
            if (!game) return;
            game.reset();
    
            // Play all moves up to the new index
            for (let i = 0; i <= newIndex; i++) {
                game.move(moves[i]);
            }
    
            setMoveIndex(newIndex);
            setPosition(game.fen());
        };
        const resetBoard = () => {
            const newGame = new Chess();
            
            // Reset everything to initial state
            setGame(newGame);
            setPosition(newGame.fen());
            setMoveIndex(-1);
            setMoves([]);
            setPgn('');
            
        };
        
   

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                multiline
                placeholder="Paste PGN here (e.g., 1. e4 e5 2. Nf3 Nc6...)"
                value={pgn}
                onChangeText={setPgn}
            />
            <Button 
                title="Analyze PGN" 
                onPress={analyzePGN}
                disabled={!game}
            />
            
            {moves.length > 0 && (
                <Text style={styles.moveInfo}>
                    Move {moveIndex + 1} of {moves.length}
                </Text>
            )}
            
            <View style={styles.boardContainer}>
                 <View style={styles.board}>
                    <Chessboard
                        fen={position}
                        key={position}  // Add this line to force re-render when position changes
                    />
                </View>
</View>     

            <View style={styles.controls}>
            <Button 
            title="Previous" 
            onPress={() => navigateMove(false)}
            disabled={moveIndex <= -1}
        />
        <Button 
            title="Reset"
            onPress={resetBoard}
            color="#ff6b6b"  // Optional: different color for reset
        />
        <Button 
            title="Next" 
            onPress={() => navigateMove(true)}
            disabled={moveIndex >= moves.length - 1}
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
        color: '#000',
    },
    boardContainer: {
        aspectRatio: 1,
        width: '100%',
        marginVertical: 20,
    },
    board: {
        flex: 1,
    },
    chessboard: {
        flex: 1,
    },
    controls: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 16,
    },
    moveInfo: {
        color: '#fff',
        textAlign: 'center',
        marginVertical: 10,
    },
});

export default PGNAnalysisScreen;