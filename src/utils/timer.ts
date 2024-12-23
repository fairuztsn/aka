export default function timer<T extends (...args: any[]) => any>(func: T): (...args: Parameters<T>) => { result: ReturnType<T>, time: number } {
    return function (...args: Parameters<T>): { result: ReturnType<T>, time: number } {
        // let totalTime = 0;
        let result: ReturnType<T>;
        const repetitions = 1_000_000;

        const start = performance.now();

        for (let i = 0; i < repetitions; i++) {
            result = func(...args)
        }

        const end = performance.now();
        const totalDurationMs = end - start;
        const avgDurationNs = ((totalDurationMs * 1_000_000) / repetitions).toFixed(2);

        //@ts-ignore
        return { result: result, time: avgDurationNs };
    };
}