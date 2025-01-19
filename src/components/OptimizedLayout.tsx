import React, { Suspense } from 'react';
import { LoadingState } from './LoadingState';
import { useInView } from 'react-intersection-observer';

type OptimizedLayoutProps = {
  children: React.ReactNode;
  threshold?: number;
  loadingMessage?: string;
};

export const OptimizedLayout: React.FC<OptimizedLayoutProps> = ({
  children,
  threshold = 0.1,
  loadingMessage,
}) => {
  const { ref, inView } = useInView({
    threshold,
    triggerOnce: true,
  });

  return (
    <div ref={ref} className="min-h-screen">
      {inView ? (
        <Suspense fallback={<LoadingState message={loadingMessage} />}>
          {children}
        </Suspense>
      ) : (
        <div className="min-h-screen" />
      )}
    </div>
  );
};