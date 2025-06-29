import { createPortal } from "react-dom";

export default function HamburgerDropdownPortal({ open, children }) {
  if (!open) return null;
  return createPortal(
    <ul
      className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1000] mt-3 p-2 shadow min-w-max fixed right-4 top-16"
    >
      {children}
    </ul>,
    document.body
  );
}
