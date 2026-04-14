"use client";

import { useEffect, useRef } from "react";

type Props = {
  onLoadMore: () => void;
  loading?: boolean;
  disabled?: boolean;
};

export const ScrollSentinel = ({ onLoadMore, loading, disabled }: Props) => {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (disabled) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const target = entries[0];

        if (target.isIntersecting && !loading && !disabled) {
          onLoadMore();
        }
      },
      {
        root: null,
        rootMargin: "150px",
        threshold: 0,
      },
    );

    const el = ref.current;
    if (el) observer.observe(el);

    return () => {
      if (el) observer.unobserve(el);
      observer.disconnect();
    };
  }, [onLoadMore, loading, disabled]);

  return <div ref={ref} className="h-10 w-full" />;
};
