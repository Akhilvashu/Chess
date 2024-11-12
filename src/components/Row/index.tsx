import React from 'react'
import { View } from 'react-native'
import Square from 'components/Square';


interface RowProps {
    row: number;
}

const Row = ({ row }: RowProps) => {
    return (
        <View style={{ flex: 1, flexDirection: 'row' }}>
            {
                new Array(8).fill(0).map((_, index) => (
                    <Square key={index} row={row} col={index}/>
                ))
            }
        </View>
    )
}

export default Row;