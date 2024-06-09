import getPixelSize from "../utils/getPixelSize";

export default class Paddle {
    public dy: number = 0;

    constructor(
        public x: number,
        public y: number,
        public width: number,
        public height: number,
    ) {}

    update(dt: number) {
        if (this.dy > 0) {
            this.y = Math.min(this.y + this.dy * dt, 100 - this.height - 1);
        } else {
            this.y = Math.max(this.y + this.dy * dt, 1);
        }
    }

    render(ctx: CanvasRenderingContext2D) {
        const x = getPixelSize(ctx.canvas, this.x, "x"),
            y = getPixelSize(ctx.canvas, this.y, "y"),
            w = getPixelSize(ctx.canvas, this.width, "x"),
            h = getPixelSize(ctx.canvas, this.height, "y");
        ctx.fillRect(x, y, w, h);
    }
}
