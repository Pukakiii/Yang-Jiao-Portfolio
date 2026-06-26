"use client";

import cardStyle from "@/shared/styles/card";
import AppItem from "./app-item";
import { webApps } from "./data/web-apps";

function AllAppsList() {
  return (
    <div className={cardStyle + "mt-5 !p-1"}>
      <div className="h-6" />
      <div className="flex flex-wrap content-center gap-7 px-6">
        {webApps.map((card, index) => (
          <AppItem
            key={card.title}
            hideBottomBorder={index === webApps.length - 1}
            card={card}
          />
        ))}
      </div>
      <div className="h-7" />
    </div>
  );
}

export default AllAppsList;
