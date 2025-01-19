export const measurePerformance = (metricName: string) => {
  if (process.env.NODE_ENV === 'development' && window.performance) {
    const start = performance.now();
    
    return () => {
      const end = performance.now();
      const duration = end - start;
      console.log(`[Performance] ${metricName}: ${duration.toFixed(2)}ms`);
      
      // Web Vitals reporting
      if (window.gtag) {
        window.gtag('event', 'performance_metric', {
          metric_name: metricName,
          value: duration,
        });
      }
    };
  }
  
  return () => {};
};

export const reportWebVitals = ({ id, name, label, value }: {
  id: string;
  name: string;
  label: string;
  value: number;
}) => {
  if (window.gtag) {
    window.gtag('event', name, {
      event_category: label === 'web-vital' ? 'Web Vitals' : 'Next.js Metrics',
      event_label: id,
      value: Math.round(name === 'CLS' ? value * 1000 : value),
      non_interaction: true,
    });
  }
};