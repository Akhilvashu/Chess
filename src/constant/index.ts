import { Dimensions } from "react-native";
import { Pieces } from "./types";
const { width } = Dimensions.get("window");

export const WHITE = "rgb(100, 133, 68)";
export const BLACK = "rgb(230, 233, 198)";

export const PIECES: Pieces = {
    br: require("assets/images/br.png"),
    bp: require("assets/images/bp.png"),
    bn: require("assets/images/bn.png"),
    bb: require("assets/images/bb.png"),
    bq: require("assets/images/bq.png"),
    bk: require("assets/images/bk.png"),
    wr: require("assets/images/wr.png"),
    wp: require("assets/images/wp.png"),
    wn: require("assets/images/wn.png"),
    wb: require("assets/images/wb.png"),
    wq: require("assets/images/wq.png"),
    wk: require("assets/images/wk.png"),
}


export const DEVICE_WIDTH = width;
export const SIZE = width/8;