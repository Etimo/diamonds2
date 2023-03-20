import { useEffect, useRef, useState } from 'react';

export default (options: any) => {
  const containerRef = useRef(null);
  const [maxWidth, setMaxWidth] = useState({
    maxWidth: '100%',
  });

  const callbackFunction = (entries: ResizeObserverEntry[]) => {
    const [entry] = entries;

    const parent = entry.target.parentElement;
    if (!parent) return;

    if (parent.offsetWidth > parent.offsetHeight) {
      setMaxWidth({
        maxWidth: `${parent.offsetHeight}px`,
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
