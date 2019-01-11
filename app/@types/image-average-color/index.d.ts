
declare module 'image-average-color' {
    interface Callback<T> {
        (error: Error, result: T) : void;
    }
    export default function average(imgFilePath: string, callback: Callback<number[]>): void;
}
