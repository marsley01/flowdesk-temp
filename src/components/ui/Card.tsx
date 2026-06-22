import { cn } from "@/lib/utils";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  raised?: boolean;
  onClick?: () => void;
}

export default function Card({ children, className, raised, onClick }: CardProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        raised ? "card-surface-raised" : "card-surface",
        onClick && "cursor-pointer hover:border-[var(--border-active)] transition-colors",
        className
      )}
    >
      {children}
    </div>
  );
}
