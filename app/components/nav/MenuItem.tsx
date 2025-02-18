import { ReactNode } from "react";

interface MenuItemProps {
  children: ReactNode;
  onClick: () => void;
}

const MenuItem = ({ children, onClick }: MenuItemProps) => {
  return (
    <div
      onClick={onClick}
      className="px-4 py-3 hover:bg-neutral-100 transition"
    >
      {children}
    </div>
  );
};

export default MenuItem;
