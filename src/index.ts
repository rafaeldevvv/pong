import "./style.css";
import trackKeys from "./utils/trackKeys";
import getPixelDimensions from "./utils/getPixelDimensions";
import getPixelSize from "./utils/getPixelSize";

let paddleSpeed = 120;
const PADDLE_SIZE = [1.4, 10] as const;
const ASPECT_RATIO = 16 / 9;

let gameState: "start" | "playing" | "end" = "start";

type DoubleNumber = [number, number];

const pressedKeys = trackKeys(["ArrowUp", "ArrowDown", "w", "s"]);
let leftPaddleY = 10;
let rightPaddleY = 80;
let leftPlayerScore = 0;
let rightPlayerScore = 0;

const ballWidth = 1.3,
    ballHeight = ballWidth * ASPECT_RATIO;

function randomInt(min: number, max: number) {
    return min + Math.round(Math.random() * (max - min));
}

let ballPosition: DoubleNumber = [50 - ballWidth / 2, 50 - ballHeight / 2];
const speedDelta = 40;
let ballSpeed: DoubleNumber = [
    Math.random() > 0.5 ? -speedDelta : speedDelta,
    randomInt(-speedDelta, speedDelta),
];

function update(dt: number) {
    if (pressedKeys.ArrowDown) {
        const newPos = rightPaddleY + paddleSpeed * dt;
        rightPaddleY = Math.min(99 - PADDLE_SIZE[1], newPos);
    } else if (pressedKeys.ArrowUp) {
        const newPos = rightPaddleY - paddleSpeed * dt;
        rightPaddleY = Math.max(1, newPos);
    }

    if (pressedKeys.w) {
        const newPos = leftPaddleY - paddleSpeed * dt;
        leftPaddleY = Math.max(1, newPos);
    } else if (pressedKeys.s) {
        const newPos = leftPaddleY + paddleSpeed * dt;
        leftPaddleY = Math.min(99 - PADDLE_SIZE[1], newPos);
    }

    switch (gameState) {
        case "start": {
            break;
        }
        case "playing": {
            const [dx, dy] = ballSpeed;
            ballPosition[0] += dx * dt;
            ballPosition[1] += dy * dt;
            break;
        }
        case "end": {
            break;
        }
        default: {
            throw new Error('Unknown game state: ' + gameState)
        }
    }
}

window.addEventListener("keydown", (e) => {
    if (e.key == "Enter") {
        if (gameState == "start") {
            gameState = "playing";
        } else {
            gameState = "start";
            ballPosition = [50 - ballWidth / 2, 50 - ballHeight / 2];
            ballSpeed = [
                Math.random() > 0.5 ? -speedDelta : speedDelta,
                randomInt(-speedDelta, speedDelta),
            ];
        }
    }
});

function drawPaddle(ctx: CanvasRenderingContext2D, pos: DoubleNumber) {
    ctx.fillStyle = "white";
    const canvas = ctx.canvas;
    const [width, height] = getPixelDimensions(canvas, PADDLE_SIZE);
    const [x, y] = getPixelDimensions(canvas, pos);
    ctx.fillRect(x, y, width, height);
}

function drawBall(ctx: CanvasRenderingContext2D, pos: DoubleNumber) {
    const [x, y] = getPixelDimensions(ctx.canvas, pos);
    const [w, h] = getPixelDimensions(ctx.canvas, [ballWidth, ballHeight]);
    ctx.fillStyle = "white";
    ctx.fillRect(x, y, w, h);
}

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
    const gap = 10
    ctx.font = `${getPixelSize(canvas, 8, "x")}px 'VT323', monospace`;
    ctx.textAlign = 'end';
    ctx.fillText(String(leftPlayerScore), getPixelSize(canvas, 50 - gap / 2, 'x'), y);
    ctx.textAlign = 'start';
    ctx.fillText(String(rightPlayerScore), getPixelSize(canvas, 50 + gap/ 2, 'x'), y);

    drawPaddle(ctx, [1, leftPaddleY]);
    drawPaddle(ctx, [100 - PADDLE_SIZE[0] - 1, rightPaddleY]);
    drawBall(ctx, ballPosition);
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
