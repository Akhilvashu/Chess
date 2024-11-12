import { Image } from 'react-native'
import React, { useCallback } from 'react'
import { PIECES, SIZE } from 'constant'
import { PieceProp } from './types'
import { styles } from './style'
import Animated, { runOnJS, runOnUI, useAnimatedGestureHandler, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated'
import { PanGestureHandler } from 'react-native-gesture-handler'
import { toPosition, toTranslation } from 'utils'
import { Square } from "chess.js"


export default function Piece({ id, position, chess, onTurn, enabled }: PieceProp) {

    const offsetX = useSharedValue(0);
    const offsetY = useSharedValue(0);

    const translateX = useSharedValue(position.x);
    const translateY = useSharedValue(position.y);

    const movePiece = useCallback((from:Square, to: Square)=>{
        const move = chess.moves({ verbose:true }).find((m) => m.from  === from && m.to === to);
        const  { x, y } = toTranslation(move ? to: from);
        translateX.value = withTiming(x);
        translateY.value = withTiming(y);

        if(move){
            chess.move(move)
            onTurn()
        }

    }, [chess, onTurn, translateX, translateY])

    const onGestureEvent = useAnimatedGestureHandler({
        onStart: () => {
            offsetX.value = translateX.value;
            offsetY.value = translateY.value;
        },

        onActive: ({ translationX, translationY }) => {
            translateX.value = translationX + offsetX.value;
            translateY.value = translationY + offsetY.value;
        },

        onEnd: () => {
            const from  = toPosition( { x: offsetX.value, y: offsetY.value })
            const to = toPosition({ x: translateX.value, y: translateY.value })
            runOnJS(movePiece)(from, to);
        }
    })

    const style = useAnimatedStyle(() => {
        return {
            position: "absolute",
            zIndex:1000,
            transform: [
                { translateX: translateX.value },
                { translateY: translateY.value },
            ],
        }
    });

    return (
        <PanGestureHandler 
            onGestureEvent={onGestureEvent}
            enabled={enabled}>
           
            <Animated.View 
                style={style}>
                <Image source={PIECES[id]} style={styles.piece}/>
            </Animated.View>
        </PanGestureHandler>
    )
}