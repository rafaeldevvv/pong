import "./style.css";
import trackKeys from "./utils/trackKeys";
import getPixelSize from "./utils/getPixelSize";
import Ball from "./components/Ball";
import Paddle from "./components/Paddle";
import getPixelDimensions from "./utils/getPixelDimensions";
import { randomInt } from "./utils/random";

const paddleSpeed = 100;
const ASPECT_RATIO = 16 / 9;

let gameState: "start" | "serve" | "play" = "start";

const pressedKeys = trackKeys(["ArrowUp", "ArrowDown", "w", "s"]);

let leftPlayerScore = 0;
let rightPlayerScore = 0;
let servingPlayer = randomInt(1, 2) == 1 ? "left" : "right";

const ballWidth = 1.3,
    ballHeight = ballWidth * ASPECT_RATIO;

const ball = new Ball(ballWidth, ballHeight);

const PADDLE_WIDTH = 1.5;
const leftPaddle = new Paddle(1, 10, PADDLE_WIDTH, PADDLE_WIDTH * 6);
const rightPaddle = new Paddle(
    100 - PADDLE_WIDTH - 1,
    62,
    PADDLE_WIDTH,
    PADDLE_WIDTH * 6,
);

window.addEventListener("keydown", (e) => {
    if (e.key == "Enter") {
        if (gameState == "start") {
            gameState = "serve";
        } else if (gameState == "serve") {
            ball.dx =
                servingPlayer == "left" ? ball.speedDelta : -ball.speedDelta;
            gameState = "play";
        }
    }
});

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

    leftPaddle.update(dt);
    rightPaddle.update(dt);

    if (gameState == "play") {
        ball.update(dt);

        if (ball.collides(leftPaddle)) {
            ball.x = leftPaddle.x + leftPaddle.width;
            ball.dx = -ball.dx * 1.03;

            if (ball.dy > 0) {
                ball.dy = randomInt(10, 30);
            } else {
                ball.dy = -randomInt(10, 30);
            }
        }

        if (ball.collides(rightPaddle)) {
            ball.x = rightPaddle.x - ball.width;
            ball.dx = -ball.dx * 1.03;

            if (ball.dy > 0) {
                ball.dy = randomInt(10, 30);
            } else {
                ball.dy = -randomInt(10, 30);
            }
        }

        if (ball.y <= 0) {
            ball.dy = -ball.dy;
            ball.y = 0;
        }

        if (ball.y >= 100 - ball.height) {
            ball.dy = -ball.dy;
            ball.y = 100 - ball.height;
        }

        // if went right
        if (ball.x >= 100) {
            ball.reset();
            leftPlayerScore++;
            servingPlayer = "right";
            gameState = "serve";
        } else if (ball.x + ball.width < 0) {
            // if went left
            ball.reset();
            rightPlayerScore++;
            servingPlayer = "left";
            gameState = "serve";
        }
    }
}

function getFont(canvas: HTMLCanvasElement, size: number) {
    return `${getPixelSize(canvas, size, "x")}px 'VT323', monospace`;
}

function displayScores(ctx: CanvasRenderingContext2D) {
    const canvas = ctx.canvas;

    const y = getPixelSize(canvas, 30, "y");
    const gap = 10;

    ctx.fillStyle = "white";
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
}

function displayFPS(ctx: CanvasRenderingContext2D, dt: number) {
    const [x, y] = getPixelDimensions(ctx.canvas, [5, 1]);
    ctx.fillStyle = "rgb(0, 255, 0)";
    ctx.textAlign = "start";
    ctx.textBaseline = "top";
    ctx.font = getFont(ctx.canvas, 3);
    ctx.fillText(`FPS ${Math.round(1 / dt)}`, x, y);
}

function draw(ctx: CanvasRenderingContext2D, dt: number) {
    const { canvas } = ctx;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = `rgb(40 45 52)`;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.textAlign = "center";
    ctx.fillStyle = `white`;

    if (gameState == "start") {
        // title
        ctx.font = getFont(ctx.canvas, 5);
        ctx.fillText(
            "Welcome to Pong!",
            getPixelSize(canvas, 50, "x"),
            getPixelSize(canvas, 10, "y"),
        );
        ctx.font = getFont(ctx.canvas, 2.5);
        ctx.fillText(
            "Press Enter to start",
            getPixelSize(canvas, 50, "x"),
            getPixelSize(canvas, 18.5, "y"),
        );
    } else if (gameState == "serve") {
        // title
        ctx.font = getFont(ctx.canvas, 4);
        ctx.fillText(
            `Player ${servingPlayer === "left" ? 1 : 0}'s serve!`,
            getPixelSize(canvas, 50, "x"),
            getPixelSize(canvas, 11, "y"),
        );
        ctx.font = getFont(ctx.canvas, 2.5);
        ctx.fillText(
            "Press Enter to serve",
            getPixelSize(canvas, 50, "x"),
            getPixelSize(canvas, 18.5, "y"),
        );
    }

    // scores
    displayScores(ctx);
    displayFPS(ctx, dt);

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
