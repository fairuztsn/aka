function slowDownForMilliseconds(ms: number) {
  const start = Date.now();
  while (Date.now() - start < ms) {

  }
}

export default function timer<T extends (...args: any[]) => any>(func: T): (...args: Parameters<T>) => {result: ReturnType<T>, time: number} {
    return function (...args: Parameters<T>): {result: ReturnType<T>, time: number} {
        const startTime = performance.now(); 
        slowDownForMilliseconds(10);
        const result = func(...args);
        const endTime = performance.now();
        const elapsedTime = parseFloat(((endTime - startTime)).toFixed(4)); 
        console.log(`Function '${func.name}' executed in ${elapsedTime} milliseconds`);
        return {result, time: elapsedTime};
    };
}