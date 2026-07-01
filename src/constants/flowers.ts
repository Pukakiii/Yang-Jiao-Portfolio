export type FlowerRole = "body";

export type FlowerPlacement = "center" | "top";

export type FlowerEntry = {
  id: string;
  file: string;
  role: FlowerRole;
  nativeWidth: number;
  nativeHeight: number;
  placement: FlowerPlacement;
  /** Per-route pastel background for pink mode (data-theme="pink"). */
  pageBackground: string;
  /** @deprecated Unused — pink mode uses pageBackground, not gray dark tints. */
  pageBackgroundDark: string;
};

export const FLOWERS: Record<string, FlowerEntry> = {
  home: {
    id: "home",
    file: "home.png",
    role: "body",
    nativeWidth: 3423,
    nativeHeight: 4232,
    placement: "center",
    pageBackground: "#E8DCDE",
    pageBackgroundDark: "#352B2D",
  },
  about: {
    id: "about",
    file: "about.png",
    role: "body",
    nativeWidth: 6720,
    nativeHeight: 4480,
    placement: "center",
    pageBackground: "#F3D7DF",
    pageBackgroundDark: "#3E272E",
  },
  work: {
    id: "work",
    file: "work.png",
    role: "body",
    nativeWidth: 5946,
    nativeHeight: 3964,
    placement: "center",
    pageBackground: "#F0D2D5",
    pageBackgroundDark: "#3C2326",
  },
  contact: {
    id: "contact",
    file: "contact.png",
    role: "body",
    nativeWidth: 3024,
    nativeHeight: 4032,
    placement: "top",
    pageBackground: "#DDC2BE",
    pageBackgroundDark: "#2C1614",
  },
};

export const ROUTE_FLOWERS: Record<string, string> = {
  "/": "home",
  "/about": "about",
  "/work": "work",
  "/contact": "contact",
};

export const FLOWER_WIDTH_CLASS = "w-[50vw] min-w-[240px] max-w-[720px]";

/** Light mode page background — plain white. */
export const DEFAULT_PAGE_BACKGROUND = "#FFFFFF";
/** Fallback pink-mode background when no route flower is mapped. */
export const DEFAULT_PINK_PAGE_BACKGROUND = "#E8DCDE";
