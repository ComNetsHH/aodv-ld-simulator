export default class MathUtils {
    static mean(arr) {
        const sum = this.sum(arr)
        return sum / arr.length;
    }

    static sum(arr) {
        return arr.reduce((acc, curr) => acc + curr, 0);
    }
}