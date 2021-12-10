import { useEffect, useState, useRef } from "react";

export default options => {
  const containerRef = useRef(null);
  const [maxWidth, setMaxWidth] = useState({
    maxWidth: "100%"
  });

  const callbackFunction = entries => {
    const [entry] = entries;

    const parent = entry.target.parentElement;
    if (parent.offsetWidth > parent.offsetHeight) {
      setMaxWidth({
        maxWidth: `${parent.offsetHeight}px`
      });
    } else {
      setMaxWidth({
        maxWidth: `${parent.offsetWidth}px`
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
