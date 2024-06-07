class Vector {
    constructor(
        public x: number,
        public y: number,
    ) {}

    plus(other: Vector) {
        return new Vector(this.x + other.x, this.y + other.y);
    }
}

export default Vector;