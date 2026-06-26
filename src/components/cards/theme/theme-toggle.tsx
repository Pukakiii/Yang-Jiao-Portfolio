"use client";

import NightIcon from "@/assets/icons/night";
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

  const switchTheme = () =>
    setTheme(resolvedTheme === "dark" ? "light" : "dark");

  const buttonClass =
    "flex rounded-full bg-light dark:bg-neutral-800/90 w-full justify-start dark:justify-end transition-all duration-300 hover:animate-scale border outline-none border-transparent hover:border-neutral-200 dark:hover:border-neutral-700/50 " +
    className;

  const thumbClass =
    "justify-end items-end h-10 w-10 rounded-full bg-white dark:bg-dark p-1 m-1 transition-all duration-300 shadow-sm hover:animate-scale " +
    thumbClassName;

  if (!mounted) {
    return (
      <button
        type="button"
        aria-label="Toggle theme"
        className={buttonClass}
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
      aria-label="Toggle theme"
      className={buttonClass}
    >
      <div className={thumbClass}>
        <SunIcon className="dark:hidden text-yellow-400 transition-all duration-300" />
        <NightIcon className="hidden dark:block text-slate-500 transition-all duration-300" />
      </div>
    </button>
  );
}
