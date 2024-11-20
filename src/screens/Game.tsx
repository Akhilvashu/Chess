import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Chess } from 'chess.js';
import Piece from 'components/Piece';
import { SIZE, DEVICE_WIDTH } from 'constant';
import Background from 'containers/Background/Background';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import {
    StatusBar,
    View,
    Modal,
    Text,
    Button,
    StyleSheet,
} from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

function Game({ navigation }: { navigation: any }): JSX.Element {

    const backgroundStyle = {
        flex: 1,
        backgroundColor: "#313131"
    };


    //initializing board height and width
    const boardStyle = {
        DEVICE_WIDTH,
        height: DEVICE_WIDTH
    }

    //initializing chess engine
    const chess = useMemo(() => new Chess(), []);
    const [ state, setState ] = useState({
        player: "w",
        board: chess.board()
    });

    // State for modal visibility and game result
    const [isModalVisible, setModalVisible] = useState(false);
    const [gameResult, setGameResult] = useState("");

    const checkGameOver = useCallback(() => {
        if (chess.isGameOver()) {
            const result = chess.isCheckmate() ? (state.player === "w" ? "White wins!" : "Black wins!") : "Draw!";
            setGameResult(result);
            setModalVisible(true);
        }
    }, [chess, state.player]);

    const onTurn = useCallback(() => {
        checkGameOver(); // Check for game over before changing turn
        setState(prevState => ({
            player: prevState.player === "w" ? "b" : "w",
            board: chess.board()
        }));
    }, [chess, checkGameOver]);

    const handlePlayAgain = () => {
        chess.reset(); // Reset the chess game
        setState({
            player: "w",
            board: chess.board()
        });
        setModalVisible(false); // Close the modal
    };

    const handleGoHome = () => {
        navigation.navigate('Home'); // Navigate to Home screen
        setModalVisible(false); // Close the modal
    };

    return (
        <GestureHandlerRootView style={{ ...backgroundStyle, justifyContent: "center" }}>
            <StatusBar hidden/> 

            <View style={boardStyle}>
                <Background/>

                {
                    state.board.map((row, i) => (
                        row.map((square, j) => {
                            if(square === null){
                                return null;
                            } else {
                                return <Piece 
                                    chess={chess}
                                    enabled={state.player === square.color}
                                    onTurn={onTurn}
                                    position={{ x: j*SIZE, y: i*SIZE }} 
                                    key={`${i}${j}`} 
                                    id={`${square.color}${square.type}` as const}/>
                            }
                        })
                    ))
                }
            </View>   

            {/* Modal for Game Over */}
            <Modal
                transparent={true}
                visible={isModalVisible}
                animationType="slide"
            >
                <View style={styles.modalContainer}>
                    <Text style={styles.modalText}>{gameResult}</Text>
                    <Button title="Play Again" onPress={handlePlayAgain} />
                    <Button title="Go to Home" onPress={handleGoHome} />
                </View>
            </Modal>
        </GestureHandlerRootView>
    );
}

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
    },
    modalText: {
        fontSize: 24,
        color: 'white',
        marginBottom: 20,
    },
});

export default Game;