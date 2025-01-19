import { useEffect, useRef } from 'react';
import { measurePerformance } from '@/utils/performance';

export const usePerformanceMonitor = (componentName: string) => {
  const mountTime = useRef<number>(0);

  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      mountTime.current = performance.now();

      return () => {
        const unmountTime = performance.now();
        const lifetime = unmountTime - mountTime.current;
        console.log(
          `[Performance] ${componentName} lifetime: ${lifetime.toFixed(2)}ms`
        );
      };
    }
  }, [componentName]);

  const measureOperation = (operationName: string) => {
    return measurePerformance(`${componentName}:${operationName}`);
  };

  return {
    measureOperation,
  };
};