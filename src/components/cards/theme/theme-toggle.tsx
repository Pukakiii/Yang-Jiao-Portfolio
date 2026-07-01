"use client";

import FlowerIcon from "@/assets/icons/flower";
import SunIcon from "@/assets/icons/sun";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function ThemeSwitcher({
  className,
  thumbClassName,
}: {
  className?: string;
  thumbClassName?: string;
}) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isPinkMode = resolvedTheme === "pink";

  const switchTheme = () => setTheme(isPinkMode ? "light" : "pink");

  const buttonClass =
    "flex rounded-full w-full transition-all duration-300 hover:animate-scale border outline-none " +
    (isPinkMode
      ? "bg-rose-200/80 justify-end border-transparent hover:border-rose-300/60 "
      : "bg-light justify-start border-transparent hover:border-neutral-200 ") +
    className;

  const thumbClass =
    "justify-end items-end h-10 w-10 rounded-full bg-white/88 p-1 m-1 transition-all duration-300 shadow-sm hover:animate-scale " +
    thumbClassName;

  if (!mounted) {
    return (
      <button
        type="button"
        aria-label="Toggle pink floral mode"
        className={
          "flex rounded-full bg-light w-full justify-start transition-all duration-300 border outline-none border-transparent " +
          className
        }
        disabled
      >
        <div className={thumbClass} />
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={switchTheme}
      aria-label={isPinkMode ? "Switch to light mode" : "Switch to pink mode"}
      className={buttonClass}
    >
      <div className={thumbClass}>
        {isPinkMode ? (
          <FlowerIcon className="text-rose-400 transition-all duration-300" />
        ) : (
          <SunIcon className="text-yellow-400 transition-all duration-300" />
        )}
      </div>
    </button>
  );
}
