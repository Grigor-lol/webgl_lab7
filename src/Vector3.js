class Vector3 {
    /**
     *
     * @param x {number}
     * @param y {number}
     * @param z {number}
     */
    constructor(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    /**
     * @public
     * @param vector {Vector3}
     * @returns {Vector3}
     */
    static normalize(vector) {
        let znam = vector.x * vector.x + vector.y * vector.y + vector.z * vector.z;
        znam = Math.sqrt(znam);
        const result = new Vector3(vector.x / znam, vector.y / znam, vector.z / znam);
        return result;
    }

    /**
     *
     * @param lhs {Vector3}
     * @param rhs {Vector3}
     * @returns {Vector3}
     */
    static cross(lhs, rhs) {
        return new Vector3(
            lhs.y * rhs.z - lhs.z * rhs.y,
            lhs.z * rhs.x - lhs.x * rhs.z,
            lhs.x * rhs.y - lhs.y * rhs.x
        );
    }

    /**
     *
     * @param vec1 {Vector3}
     * @param vec2 {Vector3}
     * @returns {number}
     */
    static dot(vec1, vec2) {
        return vec1.x * vec2.x + vec1.y * vec2.y + vec1.z * vec2.z;
    }

    /**
     *
     * @param vec1 {Vector3}
     * @param vec2 {Vector3}
     * @returns {number}
     */
    static distance(vec1, vec2) {
        const x = vec1.x - vec2.x;
        const y = vec1.y - vec2.y;
        const z = vec1.z - vec2.z;
        return Math.sqrt(x * x + y * y + z * z);
    }

    /**
     *
     * @returns {number[]}
     */
    getArray(){
        return [this.x, this.y, this.z];
    }
}


export default Vector3;

