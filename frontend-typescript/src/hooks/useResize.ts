import { useEffect, useRef, useState } from 'react';

type Options = {
  [key: string]: any;
};

type MaxWidth = {
  maxWidth: string;
};

type UseResponsiveContainer = (
  options?: Options,
) => [React.RefObject<HTMLDivElement>, MaxWidth];

const useResize: UseResponsiveContainer = (options = {}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [maxWidth, setMaxWidth] = useState<MaxWidth>({
    maxWidth: '100%',
  });

  const callbackFunction: ResizeObserverCallback = (entries) => {
    const [entry] = entries;

    const parent = entry.target.parentElement;
    if (!parent) return;
    if (parent.offsetWidth > parent.offsetHeight) {
      setMaxWidth({
        maxWidth: `${parent.offsetHeight * 0.95}px`,
      });
    } else {
      setMaxWidth({
        maxWidth: `${parent.offsetWidth}px`,
      });
    }
  };

  useEffect(() => {
    const observer = new ResizeObserver(callbackFunction);
    if (containerRef.current) observer.observe(containerRef.current);
    return () => {
      if (containerRef.current) observer.unobserve(containerRef.current);
    };
  }, [containerRef, options]);

  return [containerRef, maxWidth];
};

export default useResize;
