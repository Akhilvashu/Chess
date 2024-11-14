import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { Chess } from 'chess.js';
import Chessboard from 'react-native-chessboard';
import { mainLoop, shutdownStockfish, sendCommand } from 'react-native-stockfish-android';
import { NativeEventEmitter, NativeModules } from 'react-native';

const AIAnalysisScreen: React.FC = () => {
    const [pgn, setPgn] = useState('');
    const [position, setPosition] = useState('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1');
    const [moveIndex, setMoveIndex] = useState(0);
    const [moves, setMoves] = useState<string[]>([]);
    const [game, setGame] = useState<Chess | null>(null);
    const [analysis, setAnalysis] = useState<string>('');
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [eventListener, setEventListener] = useState<any>(null);

    useEffect(() => {
        const initStockfish = async () => {
            const eventEmitter = new NativeEventEmitter(NativeModules.ReactNativeStockfishChessEngine);
            const listener = eventEmitter.addListener('stockfish-output', (line) => {
                if (line.includes('bestmove')) {
                    const parts = line.split(' ');
                    const bestMove = parts[1];
                    const ponderMove = parts[3] || 'none';
                    console.log(`Best move: ${bestMove}, Ponder move: ${ponderMove}`);
                    setAnalysis(`Next best move: ${formatMove(bestMove)}\nBest response move: ${formatMove(ponderMove)}`);
                    setIsAnalyzing(false);
                }
            });

            await mainLoop();
            setEventListener(listener);
            setGame(new Chess());
        };

        initStockfish();

        return () => {
            if (eventListener) {
                shutdownStockfish();
                eventListener.remove();
            }
        };
    }, []);

    const analyzePosition = async () => {
        if (!game) return;

        const currentFen = game.fen();
        console.log("Analyzing position:", currentFen);

        setIsAnalyzing(true);
        setAnalysis('Analyzing...');

        try {
            await sendCommand(`position fen ${currentFen}\n`);
            await sendCommand('go movetime 1000\n');
        } catch (error) {
            console.error("Error:", error);
            setIsAnalyzing(false);
        }
    };

    const analyzePGN = () => {
        if (!game) return;
        try {
            game.loadPgn(pgn);
            const history = game.history();
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

        if (newIndex < -1 || newIndex >= moves.length) return;

        if (!game) return;
        game.reset();

        for (let i = 0; i <= newIndex; i++) {
            game.move(moves[i]);
        }

        setMoveIndex(newIndex);
        setPosition(game.fen());
    };
    
    const resetBoard = () => {
        const initialPosition = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
        const newGame = new Chess(initialPosition);
        
        setGame(newGame);
        setPosition(initialPosition);
        setMoveIndex(-1);
        setMoves([]);
        setPgn('');
    };

    const formatMove = (move: string) => {
        if (!move || move === 'none') return 'None';
        const from = move.substring(0, 2);
        const to = move.substring(2, 4);
        return `${from} → ${to}`;
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
             <Button 
                title={isAnalyzing ? "Analyzing..." : "Get Best Moves"}
                onPress={analyzePosition}
                disabled={isAnalyzing || !game}
                color="#4CAF50"
            />
            
            <View style={styles.analysisContainer}>
                <Text style={styles.analysisText}>
                    {isAnalyzing ? 'Calculating next move...' : analysis}
                </Text>
            </View>

            
            {moves.length > 0 && (
                <Text style={styles.moveInfo}>
                    Move {moveIndex + 1} of {moves.length}
                </Text>
            )}

            <View style={styles.boardContainer}>
                <View style={styles.board}>
                    <Chessboard
                        fen={position}
                        key={position}
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
                    color="#ff6b6b"
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
    analysisContainer: {
        backgroundColor: '#424242',
        padding: 15,
        borderRadius: 8,
        marginVertical: 10,
    },
    analysisText: {
        color: '#fff',
        fontSize: 20,
        textAlign: 'center',
        fontWeight: 'bold',
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
    moveInfo: {
        color: '#fff',
        textAlign: 'center',
        marginVertical: 10,
    },
});

export default AIAnalysisScreen;