"use client";

import { useEffect, useState } from "react";

type Props = object;

export default function DateTimeDialog({}: Props) {
  const [currentTime, setCurrentTime] = useState<Date | null>(null);

  useEffect(() => {
    const initialUpdate = setTimeout(() => setCurrentTime(new Date()), 0);
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);

    return () => {
      clearTimeout(initialUpdate);
      clearInterval(timer);
    };
  }, []);

  return (
    <>
      <h2 className="text-4xl xl:text-7xl my-4 text-slate-900 tracking-wide">
        {currentTime?.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })}
      </h2>
      <p className="font-medium tracking-wider text-primary">
        {currentTime?.toLocaleDateString(undefined, {
          weekday: "long",
          month: "short",
          day: "numeric",
          year: "numeric",
        })}
      </p>
    </>
  );
}
