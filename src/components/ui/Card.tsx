import { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

export default function Card({ children, className = "", onClick }: CardProps) {
  return (
    <div
      className={`bg-white rounded-lg shadow-sm border border-gray-100 p-4 ${onClick ? "cursor-pointer active:bg-gray-50" : ""} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
