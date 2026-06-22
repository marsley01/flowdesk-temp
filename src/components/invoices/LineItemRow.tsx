"use client";

import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { formatKES } from "@/lib/utils";

interface LineItem {
  id: string;
  description: string;
  quantity: number;
  unit_price: number;
  total: number;
}

interface LineItemRowProps {
  item: LineItem;
  index: number;
  onChange: (index: number, field: keyof LineItem, value: string | number) => void;
  onRemove: (index: number) => void;
}

export default function LineItemRow({ item, index, onChange, onRemove }: LineItemRowProps) {
  return (
    <tr className="group">
      <td className="py-1.5 pr-2">
        <input
          value={item.description}
          onChange={(e) => onChange(index, "description", e.target.value)}
          placeholder="Description of service..."
          className="w-full rounded-md border border-[var(--border)] bg-transparent px-3 py-1.5 text-sm text-[var(--text-primary)] outline-none transition-colors duration-200 focus:border-[var(--primary)]"
        />
      </td>
      <td className="py-1.5 pr-2">
        <input
          type="number"
          step="1" min="0"
          value={item.quantity}
          onChange={(e) => onChange(index, "quantity", parseFloat(e.target.value) || 0)}
          className="w-full rounded-md border border-[var(--border)] bg-transparent px-3 py-1.5 text-sm text-[var(--text-primary)] outline-none transition-colors duration-200 focus:border-[var(--primary)]"
        />
      </td>
      <td className="py-1.5 pr-2">
        <div className="relative">
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-xs text-[var(--text-muted)]">KES</span>
          <input
            type="number"
            step="0.01" min="0"
            value={item.unit_price}
            onChange={(e) => onChange(index, "unit_price", parseFloat(e.target.value) || 0)}
            className="w-full rounded-md border border-[var(--border)] bg-transparent py-1.5 pl-9 pr-3 text-sm text-[var(--text-primary)] outline-none transition-colors duration-200 focus:border-[var(--primary)]"
          />
        </div>
      </td>
      <td className="py-1.5 text-right font-medium text-[var(--text-primary)]">{formatKES(item.total)}</td>
      <td className="w-10 py-1.5 pl-2 no-print">
        <button
          onClick={() => onRemove(index)}
          className="flex h-7 w-7 items-center justify-center rounded-md text-[var(--error)] opacity-0 transition-opacity duration-200 hover:bg-[var(--error-muted)] group-hover:opacity-100"
        >
          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </td>
    </tr>
  );
}
