import React from 'react'
import { View } from 'react-native'
import Row from 'components/Row'


export default function Background() {
    return (
        <View style={{ flex: 1 }}>
            {
                new Array(8).fill(0).map((_, index)=>(
                    <Row key={index} row={index}/>
                ))
            }
        </View>
    )
}