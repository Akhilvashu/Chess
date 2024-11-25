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

// Position bonus for controlling center and development
const POSITION_BONUS = {
    p: [
        [0,  0,  0,  0,  0,  0,  0,  0],
        [50, 50, 50, 50, 50, 50, 50, 50],
        [10, 10, 20, 30, 30, 20, 10, 10],
        [5,  5, 10, 25, 25, 10,  5,  5],
        [0,  0,  0, 20, 20,  0,  0,  0],
        [5, -5,-10,  0,  0,-10, -5,  5],
        [5, 10, 10,-20,-20, 10, 10,  5],
        [0,  0,  0,  0,  0,  0,  0,  0]
    ],
    n: [
        [-50,-40,-30,-30,-30,-30,-40,-50],
        [-40,-20,  0,  0,  0,  0,-20,-40],
        [-30,  0, 10, 15, 15, 10,  0,-30],
        [-30,  5, 15, 20, 20, 15,  5,-30],
        [-30,  0, 15, 20, 20, 15,  0,-30],
        [-30,  5, 10, 15, 15, 10,  5,-30],
        [-40,-20,  0,  5,  5,  0,-20,-40],
        [-50,-40,-30,-30,-30,-30,-40,-50]
    ]
};

const evaluatePosition = (game: Chess): number => {
    let score = 0;
    const board = game.board();
    
    // Material and position evaluation
    for(let i = 0; i < 8; i++) {
        for(let j = 0; j < 8; j++) {
            const piece = board[i][j];
            if(piece) {
                // Base piece value
                const value = PIECE_VALUES[piece.type];
                
                // Add position bonus for pawns and knights
                let positionBonus = 0;
                if (piece.type === 'p' || piece.type === 'n') {
                    const row = piece.color === 'w' ? i : 7 - i;
                    positionBonus = POSITION_BONUS[piece.type][row][j];
                }
                
                // White pieces add to score, Black pieces subtract
                score += piece.color === 'w' ? 
                    (value + positionBonus) : 
                    -(value + positionBonus);
            }
        }
    }
    
    return score;
};

const alphaBeta = (
    game: Chess, 
    depth: number, 
    alpha: number, 
    beta: number, 
    isMaximizing: boolean
): number => {
    if (depth === 0) {
        return evaluatePosition(game);
    }

    const moves = game.moves({ verbose: true });
    
    if (moves.length === 0) {
        if (game.isCheckmate()) {
            return isMaximizing ? -Infinity : Infinity;
        }
        return 0; // Draw
    }

    if (isMaximizing) {
        let maxEval = -Infinity;
        for (const move of moves) {
            game.move(move);
            const evaluation = alphaBeta(game, depth - 1, alpha, beta, false);
            game.undo();
            
            maxEval = Math.max(maxEval, evaluation);
            alpha = Math.max(alpha, evaluation);
            if (beta <= alpha) break;
        }
        return maxEval;
    } else {
        let minEval = Infinity;
        for (const move of moves) {
            game.move(move);
            const evaluation = alphaBeta(game, depth - 1, alpha, beta, true);
            game.undo();
            
            minEval = Math.min(minEval, evaluation);
            beta = Math.min(beta, evaluation);
            if (beta <= alpha) break;
        }
        return minEval;
    }
};

const findBestMove = (game: Chess): any => {
    console.log("Bot starting to think...");
    const moves = game.moves({ verbose: true });
    let bestMove = null;
    let bestValue = Infinity;
    
    const searchDepth = 2;
    
    for (const move of moves) {
        console.log(`Analyzing move: ${move.san}`);
        game.move(move);
        const evaluation = alphaBeta(game, searchDepth, -Infinity, Infinity, true);
        game.undo();
        
        console.log(`Move ${move.san} evaluated to: ${evaluation}`);
        
        if (evaluation < bestValue) {
            bestValue = evaluation;
            bestMove = move;
            console.log(`New best move found: ${move.san}`);
        }
    }
    
    console.log(`Bot chose move: ${bestMove?.san}`);
    return bestMove || moves[0];
};

const ComputerGame: React.FC = () => {
    const initialPosition = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
    
    const [game, setGame] = useState<Chess | null>(null);
    const [position, setPosition] = useState(initialPosition);
    const [status, setStatus] = useState<string>('Your turn - make your move.');
    const [moves, setMoves] = useState<string[]>([]);
    const [moveIndex, setMoveIndex] = useState(-1);
    const [key, setKey] = useState(0);
    const chessboardRef = useRef<React.ElementRef<typeof Chessboard>>(null);

    useEffect(() => {
        try {
            const newGame = new Chess();
            setGame(newGame);
            setPosition(newGame.fen());
            setStatus('Your turn - make your move.');
        } catch (error) {
            console.error('Error initializing chess:', error);
            Alert.alert('Error', 'Failed to initialize chess engine');
        }
    }, [key]);

    const resetBoard = () => {
        try {
            setKey(prevKey => prevKey + 1);
            setStatus('Your turn - make your move.');
        } catch (error) {
            console.error('Error resetting board:', error);
            Alert.alert('Error', 'Failed to reset the game');
        }
    };

    const handleMove = ({ state }: { state: any }) => {
        if (!game || game.turn() === 'b') return;
        
        try {
            game.load(state.fen);
            setPosition(state.fen);
            
            // Check if the game is over after player's move
            if (game.isCheckmate()) {
                setStatus('Game Over - Checkmate! Player wins.');
                return;
            } else if (game.isDraw()) {
                setStatus('Game Over - Draw.');
                return;
            }

            // Only after confirming it's a valid player move, trigger bot's turn
            setStatus("Bot's turn - evaluating moves...");
            setTimeout(makeBotMove, 500);
        } catch (error) {
            console.error('Error making move:', error);
        }
    };

    const makeBotMove = () => {
        if (!game || game.turn() !== 'b') return;

        try {
            // Bot is already thinking, no need to set status again here
            setTimeout(() => {
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
                    setStatus('Game Over - Checkmate! Bot wins.');
                } else if (game.isDraw()) {
                    setStatus('Game Over - Draw.');
                } else {
                    setStatus('Your turn - make your move.');
                }
            }, 100);
            
        } catch (error) {
            console.error('Error making bot move:', error);
            setStatus('Error occurred during move calculation.');
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

            <Text style={styles.status}>{status}</Text>

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
