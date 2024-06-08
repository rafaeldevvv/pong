export default function getPixelSize(
    canvas: HTMLCanvasElement,
    percentage: number,
    dimension: "x" | "y",
) {
    percentage = percentage / 100;
    if (dimension === "x") {
        return percentage * canvas.width;
    } else {
        return percentage * canvas.height;
    }
}