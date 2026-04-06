"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  label: string;
  options: string[];
  selected: string[];
  setSelected: (val: string[]) => void;
};

export default function MultiSelect({
  label,
  options,
  selected,
  setSelected,
}: Props) {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  const toggle = (value: string) => {
    if (selected.includes(value)) {
      setSelected(selected.filter((v) => v !== value));
    } else {
      setSelected([...selected, value]);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!wrapperRef.current) return;

      if (!wrapperRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={wrapperRef}>
      <p className="mb-2 text-sm font-medium text-slate-800">{label}</p>

      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-left text-sm text-slate-700 outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
      >
        {selected.length > 0 ? selected.join(", ") : "Select options"}
      </button>

      {open && (
        <div className="absolute z-50 mt-2 max-h-60 w-full overflow-auto rounded-2xl border border-slate-200 bg-white shadow-lg">
          {options.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => toggle(item)}
              className={`block w-full px-4 py-2 text-left text-sm transition hover:bg-slate-50 ${
                selected.includes(item)
                  ? "bg-blue-50 text-blue-700"
                  : "text-slate-700"
              }`}
            >
              {item}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}