import { useMemo } from "react";

type Props = { count?: number };

export function SparkleField({ count = 20 }: Props) {
  const stars = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        top: `${(i * 17 + 7) % 100}%`,
        left: `${(i * 23 + 11) % 100}%`,
        fontSize: 8 + (i % 5) * 2,
        delay: `${(i % 5) * 0.6}s`,
      })),
    [count],
  );

  return (
    <>
      {stars.map((s) => (
        <span
          key={s.id}
          className="absolute text-yellow-300 animate-pulse pointer-events-none"
          style={{
            top: s.top,
            left: s.left,
            fontSize: `${s.fontSize}px`,
            animationDelay: s.delay,
          }}
          aria-hidden
        >
          ✦
        </span>
      ))}
    </>
  );
}
