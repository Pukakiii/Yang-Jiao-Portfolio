"use client";

import MenuIcon from "@/assets/icons/menu";
import ThemeSwitcher from "@/components/cards/theme/theme-toggle";
import AppPaths from "@/constants/paths";
import Link from "next/link";
import { useEffect, useState } from "react";
import useAppPathname from "../hooks/pathname";
import cardStyle from "../styles/card";
import { scrollToTop } from "../utils/window";
import useDropDownMenu from "./dropdowns/menu";

function Header() {
  const pathname = useAppPathname();
  const [path, setPath] = useState(pathname);

  useEffect(() => {
    setPath(pathname);
  }, [pathname]);

  const themeSwitcher = (
    <ThemeSwitcher
      className="hover:animate-none !w-[80px]"
      thumbClassName="h-7 w-7"
    />
  );

  const btnStyle =
    "py-4 px-6 sm:py-[8px] sm:px-4 hover:bg-neutral-200/70 hover:text-black rounded-full ";
  const items = AppPaths.main.map((card) => {
    const isSelected = path === card.path;
    return (
      <Link
        key={card.name}
        onClick={() => {
          scrollToTop();
          setPath(card.path);
          if (dropDown.isOpen) dropDown.setOpen(false);
        }}
        href={card.path}
      >
        <div
          className={
            btnStyle +
            "text-base font-normal min-w-[200px] sm:min-w-0 text-start " +
            (isSelected ? "text-black" : "")
          }
        >
          {card.name}
        </div>
      </Link>
    );
  });

  const dropDown = useDropDownMenu({
    menu: (
      <div
        className={
          cardStyle +
          "!bg-white/85 backdrop-blur-md backdrop-saturate-150 px-3 py-4 justify-start shadow-md"
        }
      >
        {items}
      </div>
    ),
  });

  return (
    <header className="sticky top-0 z-50 w-full overflow-hidden rounded-3xl border border-neutral-400/10 bg-white/50 pt-5 backdrop-blur-md backdrop-saturate-150">
      <div
        className={
          cardStyle +
          "!bg-white/85 !p-1 !flex-row items-center justify-between rounded-3xl w-full text-sm text-neutral-500 text-center !px-1.5"
        }
      >
        <div className="hidden sm:flex flex-wrap items-center w-full">
          {items}
        </div>
        <div>
          <button
            onClick={() => dropDown.setOpen(!dropDown.isOpen)}
            className={btnStyle + "flex sm:hidden !py-1.5 !px-4"}
          >
            <MenuIcon
              className="w-7 h-7 text-dark"
              strokeWidth={2}
            />
          </button>
          <div className="sm:hidden">{dropDown.dropdown}</div>
        </div>
        {themeSwitcher}
      </div>
    </header>
  );
}

export default Header;
