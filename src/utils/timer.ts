export default function timer<T extends (...args: any[]) => any>(func: T): (...args: Parameters<T>) => { result: ReturnType<T>, time: number } {
    return function (...args: Parameters<T>): { result: ReturnType<T>, time: number } {
        let totalTime = 0;
        let result: ReturnType<T>;
        const repetitions = 100; 

        for (let i = 0; i < repetitions; i++) {
            const startTime = performance.now() * 1_000_000;
                      
            result = func(...args); 

            const endTime = performance.now() * 1_000_000;
            const elapsedTime = endTime - startTime; 

            totalTime += elapsedTime; 
        }

        const averageTime = totalTime / repetitions;

        console.log(totalTime, repetitions);

        //@ts-ignore
        return { result: result, time: averageTime };
    };
}
