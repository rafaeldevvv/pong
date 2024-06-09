import getPixelSize from "../utils/getPixelSize";
import { randomInt } from "../utils/random";
import type Paddle from "./Paddle";

export default class Ball {
    readonly speedDelta = 40;
    dx = Math.random() > 0.5 ? -this.speedDelta : this.speedDelta;
    dy = randomInt(-this.speedDelta, this.speedDelta);
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
        this.dx = Math.random() > 0.5 ? -this.speedDelta : this.speedDelta;
        this.dy = randomInt(-this.speedDelta, this.speedDelta);
        this.x = 50 - this.width / 2;
        this.y = 50 - this.height / 2;
    }

    collides(paddle: Paddle) {
        if (
            this.x > paddle.x + paddle.width ||
            this.x + this.width < paddle.x
        ) {
            return false;
        }
        if (
            this.y > paddle.y + paddle.height ||
            this.y + this.height < paddle.y
        ) {
            return false;
        }
        return true;
    }

    render(ctx: CanvasRenderingContext2D) {
        const x = getPixelSize(ctx.canvas, this.x, "x"),
            y = getPixelSize(ctx.canvas, this.y, "y"),
            w = getPixelSize(ctx.canvas, this.width, "x"),
            h = getPixelSize(ctx.canvas, this.height, "y");
        ctx.fillStyle = "white";
        ctx.fillRect(x, y, w, h);
    }
}
