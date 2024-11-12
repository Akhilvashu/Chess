export type Player = "b" | "w";
export type Type = "q" | "k" | "b" | "r" | "n" | "p";
export type Piece = `${Player}${Type}`
export type Pieces = Record<Piece, ReturnType<typeof require>>