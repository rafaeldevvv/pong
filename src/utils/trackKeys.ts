export default function trackKeys<Keys extends string>(
    keys: Keys[],
): {
    [Key in Keys]: boolean;
} & {
    unregister: () => void;
} {
    const down = {} as ReturnType<typeof trackKeys<Keys>>;

    function press(e: KeyboardEvent) {
        if (keys.includes(e.key as Keys)) {
            // it is not currently possible to tell typescript
            // that Keys are any string except "unregister"
            // so i'm using @ts-ignore
            // @ts-ignore
            down[e.key as Keys] = e.type === "keydown";
        }
    }
    window.addEventListener("keydown", press);
    window.addEventListener("keyup", press);
    down.unregister = function () {
        window.removeEventListener("keydown", press);
        window.removeEventListener("keyup", press);
    };

    return down;
}
