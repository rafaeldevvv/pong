import getPixelSize from "./getPixelSize";

export default function getPixelDimensions(
    canvas: HTMLCanvasElement,
    pos: readonly [number, number],
) {
    const x = getPixelSize(canvas, pos[0], "x"),
        y = getPixelSize(canvas, pos[1], "y");
    return [x, y];
}