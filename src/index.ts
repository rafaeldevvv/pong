import "./style.css";
import trackKeys from "./utils/trackKeys";

let paddleSpeed = 120;
const PADDLE_SIZE = [1.4, 10] as const;
const CANVAS_ASPECT_RATIO = 16 / 9;

let gameState: "start" | "playing" | "end" = "playing";

const pressedKeys = trackKeys(["ArrowUp", "ArrowDown", "w", "s"]);
let leftPaddleY = 10;
let rightPaddleY = 80;
let leftPlayerScore = 0;
let rightPlayerScore = 0;

const ballWidth = 1.3;

function update(dt: number) {
    switch (gameState) {
        case "start": {
            break;
        }
        case "playing": {
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

function getPixelSize(
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

function getPixelDimensions(
    canvas: HTMLCanvasElement,
    pos: readonly [number, number],
) {
    const x = getPixelSize(canvas, pos[0], "x"),
        y = getPixelSize(canvas, pos[1], "y");
    return [x, y];
}

function drawPaddle(ctx: CanvasRenderingContext2D, pos: [number, number]) {
    ctx.fillStyle = "white";
    const canvas = ctx.canvas;
    const [width, height] = getPixelDimensions(canvas, PADDLE_SIZE);
    const [x, y] = getPixelDimensions(canvas, pos);
    ctx.fillRect(x, y, width, height);
}

function drawBall(ctx: CanvasRenderingContext2D, pos: [number, number]) {
    const [x, y] = getPixelDimensions(ctx.canvas, pos);
    const [w, h] = getPixelDimensions(ctx.canvas, [
        ballWidth,
        ballWidth * CANVAS_ASPECT_RATIO,
    ]);
    ctx.fillStyle = "white";
    ctx.fillRect(x - w / 2, y - h / 2, w, h);
}

function draw(ctx: CanvasRenderingContext2D, dt: number) {
    const { canvas } = ctx;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = `rgb(40 45 52)`;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.font = `${getPixelSize(canvas, 6, "x")}px monospace`;
    ctx.textAlign = "center";
    ctx.fillStyle = `white`;
    ctx.fillText(
        "Pong",
        getPixelSize(canvas, 50, "x"),
        getPixelSize(canvas, 10, "x"),
    );

    drawPaddle(ctx, [1, leftPaddleY]);
    drawPaddle(ctx, [100 - PADDLE_SIZE[0] - 1, rightPaddleY]);
    drawBall(ctx, [50, 50]);
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
    let width = innerHeight * CANVAS_ASPECT_RATIO;
    if (width > innerWidth) {
        width = innerWidth;
        canvas.width = width;
        canvas.height = width / CANVAS_ASPECT_RATIO;
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
