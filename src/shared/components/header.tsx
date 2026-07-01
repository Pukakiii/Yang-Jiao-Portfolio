"use client";

import MenuIcon from "@/assets/icons/menu";
import ThemeSwitcher from "@/components/cards/theme/theme-toggle";
import AppPaths from "@/constants/paths";
import Link from "next/link";
import { useEffect, useState } from "react";
import useAppPathname from "../hooks/pathname";
import cardStyle from "../styles/card";
import { scrollToTop } from "../utils/window";

function Header() {
  const pathname = useAppPathname();
  const [path, setPath] = useState(pathname);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setPath(pathname);
  }, [pathname]);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  const closeMenu = () => setMenuOpen(false);

  const navLinkClass = (isSelected: boolean, mobile: boolean) =>
    [
      mobile
        ? "block w-full rounded-2xl px-4 py-3.5 text-base font-normal text-left transition-colors"
        : "py-[8px] px-4 text-base font-normal rounded-full transition-colors",
      isSelected
        ? "bg-neutral-200/80 text-black font-medium"
        : "text-neutral-600 hover:bg-neutral-200/70 hover:text-black",
    ].join(" ");

  const renderNavLinks = (mobile: boolean) =>
    AppPaths.main.map((card) => {
      const isSelected = path === card.path;
      return (
        <Link
          key={`${mobile ? "mobile" : "desktop"}-${card.path}`}
          href={card.path}
          onClick={() => {
            scrollToTop();
            setPath(card.path);
            if (mobile) closeMenu();
          }}
        >
          <span className={navLinkClass(isSelected, mobile)}>{card.name}</span>
        </Link>
      );
    });

  return (
    <header className="sticky top-0 z-50 w-full pt-5">
      <div className="overflow-visible rounded-3xl border border-neutral-400/10 bg-white shadow-sm">
        <div
          className={
            cardStyle +
            "!bg-white !p-1.5 !flex-row items-center justify-between rounded-3xl w-full text-sm !px-2 !border-0"
          }
        >
          <nav className="hidden sm:flex flex-wrap items-center gap-0.5">
            {renderNavLinks(false)}
          </nav>

          <button
            type="button"
            className="flex rounded-full p-2 hover:bg-neutral-200/70 sm:hidden"
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            aria-label={
              menuOpen ? "Close navigation menu" : "Open navigation menu"
            }
          >
            <MenuIcon className="h-7 w-7 text-dark" strokeWidth={2} />
          </button>

          <ThemeSwitcher
            className="hover:animate-none !w-[80px]"
            thumbClassName="h-7 w-7"
          />
        </div>

        {menuOpen && (
          <nav
            className="mx-1.5 mb-1.5 mt-1 flex flex-col gap-1 border-t border-neutral-200/80 pt-1 sm:hidden"
            aria-label="Mobile navigation"
          >
            {renderNavLinks(true)}
          </nav>
        )}
      </div>
    </header>
  );
}

export default Header;
