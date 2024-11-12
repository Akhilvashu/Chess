import { View, Text } from 'react-native'
import React from 'react'

//import black/white color for board
import { WHITE, BLACK } from 'constant'


interface SquareProps {
    row: number;
    col: number;
}


const Square = ({ row, col }: SquareProps) => {
    
    //defining color for this particular 
    //square based on row and col
    const backgroundColor = (row + col) % 2 === 0 ? WHITE: BLACK; 
    const color = (row + col) % 2 !== 0 ? WHITE: BLACK; 
    
    return(
        <View style={{ flex: 1, backgroundColor, padding: 4, justifyContent: "space-between" }}>
            <Text 
                style={{ 
                    color, 
                    fontWeight: "500", 
                    opacity: col === 0 ? 1: 0 }}>{8-row}</Text>

            <Text
                style={{
                    color,
                    alignSelf: 'flex-end',
                    fontWeight: "500",
                    opacity: row === 7 ? 1: 0
                }}>{String.fromCharCode("a".charCodeAt(0)+ col)}</Text>
        </View>
    )
}

export default Square;