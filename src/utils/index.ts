import { Square } from "chess.js"
import { SIZE } from "constant";
import { Vector } from 'react-native-redash'


export const toTranslation = (to: Square) => {
    "worklet";
    const token = to.split("");
    const col = token[0];
    const row = token[1];

    if(!row || !col){
        throw new Error("Invalid position" + to)
    }

    const indices = {
        x: col.charCodeAt(0) - "a".charCodeAt(0),
        y: parseInt(row, 10) - 1,
    }

    return {
        x: indices.x * SIZE,
        y: 7 * SIZE - indices.y *SIZE
    }
}


export const toPosition = ({ x, y }: Vector) => {
    "worklet";
    const col = String.fromCharCode(97+ Math.round(x / SIZE));
    const row = `${8- Math.round(y / SIZE)}`;

    return `${col}${row}` as Square;
}