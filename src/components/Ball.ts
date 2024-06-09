import getPixelSize from "../utils/getPixelSize";
import { randomInt } from "../utils/random";

const speedDelta = 40;

export default class Ball {
    dx = Math.random() > 0.5 ? -speedDelta : speedDelta;
    dy = randomInt(-speedDelta, speedDelta);
    x: number;
    y: number;

    constructor(
        public width: number,
        public height: number,
    ) {
        this.x = 50 - this.width / 2;
        this.y = 50 - this.height / 2;
    }

    update(dt: number) {
        this.x += this.dx * dt;
        this.y += this.dy * dt;
    }

    reset() {
        this.dx = Math.random() > 0.5 ? -speedDelta : speedDelta;
        this.dy = randomInt(-speedDelta, speedDelta);
        this.x = 50 - this.width / 2;
        this.y = 50 - this.height / 2;
    }

    render(ctx: CanvasRenderingContext2D) {
        const x = getPixelSize(ctx.canvas, this.x, "x"),
            y = getPixelSize(ctx.canvas, this.y, "y"),
            w = getPixelSize(ctx.canvas, this.width, "x"),
            h = getPixelSize(ctx.canvas, this.height, "y");
        ctx.fillStyle = 'white';
        ctx.fillRect(x, y, w, h);
    }
}
