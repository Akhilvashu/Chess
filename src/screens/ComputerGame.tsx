import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Button, StyleSheet, Alert } from 'react-native';
import { Chess } from 'chess.js';
import Chessboard from 'react-native-chessboard';

// Piece values and position weights
const PIECE_VALUES = {
    p: 100,
    n: 320,
    b: 330,
    r: 500,
    q: 900,
    k: 20000
};

const evaluatePosition = (game: Chess): number => {
    let score = 0;
    const board = game.board();
    
    for(let i = 0; i < 8; i++) {
        for(let j = 0; j < 8; j++) {
            const piece = board[i][j];
            if(piece) {
                const value = PIECE_VALUES[piece.type];
                score += piece.color === 'w' ? -value : value;
            }
        }
    }
    return score;
}

const findBestMove = (game: Chess): any => {
    const moves = game.moves({ verbose: true });
    let bestMove = moves[0];
    let bestScore = -Infinity;
    
    for (const move of moves) {
        game.move(move);
        const score = evaluatePosition(game);
        game.undo();
        
        if (score > bestScore) {
            bestScore = score;
            bestMove = move;
        }
    }
    
    return bestMove;
}

const ComputerGame: React.FC = () => {
    const initialPosition = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
    
    const [game, setGame] = useState<Chess | null>(null);
    const [position, setPosition] = useState(initialPosition);
    const [status, setStatus] = useState<string>('Your turn');
    const [moves, setMoves] = useState<string[]>([]);
    const [moveIndex, setMoveIndex] = useState(-1);
    const [key, setKey] = useState(0);
    const chessboardRef = useRef<React.ElementRef<typeof Chessboard>>(null);

    useEffect(() => {
        try {
            const newGame = new Chess();
            setGame(newGame);
            setPosition(newGame.fen());
            setStatus('Your turn');
        } catch (error) {
            console.error('Error initializing chess:', error);
            Alert.alert('Error', 'Failed to initialize chess engine');
        }
    }, [key]);

    const resetBoard = () => {
        try {
            setKey(prevKey => prevKey + 1);
            setStatus('Your turn');
        } catch (error) {
            console.error('Error resetting board:', error);
            Alert.alert('Error', 'Failed to reset the game');
        }
    };

    const handleMove = ({ state }: { state: any }) => {
        if (!game || game.turn() === 'b') return;
        
        try {
            // Sync our game state with the chessboard's state
            game.load(state.fen);
            setPosition(state.fen);
            
            // Check if the game is over after player's move
            if (game.isCheckmate()) {
                setStatus('Checkmate! Player wins!');
                return;
            } else if (game.isDraw()) {
                setStatus('Draw!');
                return;
            }

            // Only trigger bot move if game isn't over
            setStatus("Bot is thinking...");
            setTimeout(makeBotMove, 500);
        } catch (error) {
            console.error('Error making move:', error);
        }
    };

    const makeBotMove = () => {
        if (!game || game.turn() !== 'b') return;

        try {
            const bestMove = findBestMove(game);
            if (!bestMove) return;
            
            game.move(bestMove);
            setPosition(game.fen());
            
            if (chessboardRef.current) {
                chessboardRef.current.move({ 
                    from: bestMove.from, 
                    to: bestMove.to 
                });
            }

            if (game.isCheckmate()) {
                setStatus('Checkmate! Bot wins!');
            } else if (game.isDraw()) {
                setStatus('Draw!');
            } else {
                setStatus('Your turn');
            }
        } catch (error) {
            console.error('Error making bot move:', error);
        }
    };

    return (
        <View style={styles.container} key={`game-container-${key}`}>
            <View style={styles.infoContainer}>
                <View style={styles.playerInfo}>
                    <Text style={styles.playerLabel}>Bot (Black)</Text>
                    <View style={[styles.colorIndicator, { backgroundColor: '#000' }]} />
                </View>
            </View>

            <View style={styles.boardContainer}>
                <View style={styles.board}>
                    <Chessboard
                        fen={position}
                        key={`board-${key}`}
                        onMove={handleMove}
                        gestureEnabled={game?.turn() === 'w'}
                        ref={chessboardRef}
                    />
                </View>
            </View>

            <View style={styles.bottomContainer}>
                <View style={styles.infoContainer}>
                    <View style={styles.playerInfo}>
                        <Text style={styles.playerLabel}>Player (White)</Text>
                        <View style={[styles.colorIndicator, { backgroundColor: '#fff' }]} />
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
});

export default ComputerGame;
