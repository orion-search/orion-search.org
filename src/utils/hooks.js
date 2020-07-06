/* eslint-disable no-sequences */
import { useRef, useState, useEffect } from "react";
import ResizeObserver from "resize-observer-polyfill";

export const useMeasure = () => {
  const ref = useRef();
  const [bounds, set] = useState({ left: 0, top: 0, width: 0, height: 0 });
  const [ro] = useState(
    () => new ResizeObserver(([entry]) => set(entry.contentRect))
  );
  useEffect(() => (ro.observe(ref.current), ro.disconnect), [ro]);
  return [{ ref }, bounds];
};
