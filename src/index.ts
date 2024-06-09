import "./style.css";
import trackKeys from "./utils/trackKeys";
import getPixelSize from "./utils/getPixelSize";
import Ball from "./components/Ball";
import Paddle from "./components/Paddle";

let paddleSpeed = 120;
const ASPECT_RATIO = 16 / 9;

let gameState: "start" | "playing" | "end" = "start";

const pressedKeys = trackKeys(["ArrowUp", "ArrowDown", "w", "s"]);

let leftPlayerScore = 0;
let rightPlayerScore = 0;

const ballWidth = 1.3,
    ballHeight = ballWidth * ASPECT_RATIO;

const ball = new Ball(
    ballWidth,
    ballHeight,
);

const PADDLE_WIDTH = 1.5;
const leftPaddle = new Paddle(1, 10, PADDLE_WIDTH, PADDLE_WIDTH * 6);
const rightPaddle = new Paddle(100 - PADDLE_WIDTH - 1, 62, PADDLE_WIDTH, PADDLE_WIDTH * 6);

function update(dt: number) {
    if (pressedKeys.ArrowDown) {
        rightPaddle.dy = paddleSpeed;
    } else if (pressedKeys.ArrowUp) {
        rightPaddle.dy = -paddleSpeed;
    } else {
        rightPaddle.dy = 0;
    }

    if (pressedKeys.w) {
        leftPaddle.dy = -paddleSpeed;
    } else if (pressedKeys.s) {
        leftPaddle.dy = paddleSpeed;
    } else {
        leftPaddle.dy = 0;
    }

    leftPaddle.update(dt)
    rightPaddle.update(dt)

    switch (gameState) {
        case "start": {
            break;
        }
        case "playing": {
            ball.update(dt);
            break;
        }
        case "end": {
            break;
        }
        default: {
            throw new Error("Unknown game state: " + gameState);
        }
    }
}

window.addEventListener("keydown", (e) => {
    if (e.key == "Enter") {
        if (gameState == "start") {
            gameState = "playing";
        } else {
            gameState = "start";
            ball.reset();
        }
    }
});

function draw(ctx: CanvasRenderingContext2D, dt: number) {
    const { canvas } = ctx;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = `rgb(40 45 52)`;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.font = `${getPixelSize(canvas, 6, "x")}px 'VT323', monospace`;
    ctx.textAlign = "center";
    ctx.fillStyle = `white`;

    // title
    ctx.fillText(
        "Pong",
        getPixelSize(canvas, 50, "x"),
        getPixelSize(canvas, 14, "y"),
    );

    // scores
    const y = getPixelSize(canvas, 30, "y");
    const gap = 10;
    ctx.font = `${getPixelSize(canvas, 8, "x")}px 'VT323', monospace`;
    ctx.textAlign = "end";
    ctx.fillText(
        String(leftPlayerScore),
        getPixelSize(canvas, 50 - gap / 2, "x"),
        y,
    );
    ctx.textAlign = "start";
    ctx.fillText(
        String(rightPlayerScore),
        getPixelSize(canvas, 50 + gap / 2, "x"),
        y,
    );

    leftPaddle.render(ctx);
    rightPaddle.render(ctx);
    ball.render(ctx);
}

function runAnimation(callback: (dt: number) => boolean) {
    let lastTime: null | number = null;
    function frame(time: number) {
        if (lastTime !== null) {
            const timePassed = Math.min(100, time - lastTime) / 1000;
            lastTime = time;
            if (callback(timePassed)) requestAnimationFrame(frame);
        } else {
            lastTime = time;
            requestAnimationFrame(frame);
        }
    }
    requestAnimationFrame(frame);
}

function setCanvasSize(canvas: HTMLCanvasElement) {
    let width = innerHeight * ASPECT_RATIO;
    if (width > innerWidth) {
        width = innerWidth;
        canvas.width = width;
        canvas.height = width / ASPECT_RATIO;
    } else {
        canvas.width = width;
        canvas.height = innerHeight;
    }
}

function main() {
    const canvas = document.createElement("canvas");
    document.querySelector("#app")!.appendChild(canvas);
    const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
    setCanvasSize(canvas);

    window.addEventListener("resize", () => {
        setCanvasSize(canvas);
    });

    runAnimation((dt) => {
        update(dt);
        draw(ctx, dt);
        return true;
    });
}

main();
