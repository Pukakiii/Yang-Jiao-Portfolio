"use client";

import { useState } from "react";

function useDropDownMenu({ menu }: { menu?: React.ReactNode }) {
  const [isOpen, setOpen] = useState(false);
  const dropdown = (
    <div className="absolute left-0 top-full z-[60] w-max min-w-[200px]" role="menu">
      {isOpen && (
        <div
          className="fixed inset-0 z-[55] bg-neutral-800/20 backdrop-blur-sm"
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
      )}
      {isOpen && <div className="relative z-[60] mt-2">{menu}</div>}
    </div>
  );

  return { dropdown, isOpen, setOpen };
}

export default useDropDownMenu;
