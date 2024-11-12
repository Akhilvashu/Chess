import { Chess } from 'chess.js';
import Piece from 'components/Piece';
import { SIZE, DEVICE_WIDTH } from 'constant';
import Background from 'containers/Background/Background';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import {
    Dimensions,
    StatusBar,
    View,
} from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';


function useConst<T>(initialValue: T | (() => T)): T {
    const ref = useRef<{ value: T }>();
    if (ref.current === undefined) {
        ref.current = {
            value:
            typeof initialValue === "function"
                ? (initialValue as Function)()
                : initialValue,
        };
    }
    return ref.current.value;
}


function App(): JSX.Element {

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

    const onTurn = useCallback(()=>{
        setState({
            player: state.player === "w" ? "b": "w",
            board: chess.board()
        })
    },[chess, state.player])

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

        </GestureHandlerRootView>
    );
}

export default App;
