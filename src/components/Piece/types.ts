import { Vector } from 'react-native-redash'
import { Chess } from "chess.js"


export interface PieceProp {
    id: Piece;
    position: Vector;
    chess: Chess;
    onTurn: () => void;
    enabled: boolean;
}

export type Player = "b" | "w";
export type Type = "q" | "k" | "b" | "r" | "n" | "p";
export type Piece = `${Player}${Type}`
