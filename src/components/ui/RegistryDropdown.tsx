"use client";

import { useState, useRef, useEffect } from "react";
import { MdOutlineArrowDropDown } from "react-icons/md";


export interface DropdownOption {
  value: string;
  label: string;
}

interface RegistryDropdownProps {
  options: DropdownOption[];
  selected: string;
  onChange: (value: string) => void;
}

const RegistryDropdown = ({ options, selected, onChange }: RegistryDropdownProps) => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!dropdownRef.current?.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const selectedLabel = options.find((o) => o.value === selected)?.label || "Select";

  return (
    <div ref={dropdownRef} className="relative min-w-[190px]">
      {/* TOP BUTTON */}
      <button
        onClick={() => setOpen(!open)}
        className={`flex h-14 w-full items-center justify-between 
          rounded-xl border border-gray-300 bg-white px-5 
          text-sm font-semibold text-gray-800 transition-colors
          ${open ? "rounded-b-none border-b-0" : ""}
        `}
      >
        <span>{selectedLabel}</span>
		<span className="text-4xl"><MdOutlineArrowDropDown /></span>
      </button>

      {/* DROPDOWN PANEL */}
      {open && (
        <div
          className="absolute left-0 top-14 w-full overflow-hidden 
            border border-gray-300 border-t-0 
            bg-white shadow-sm rounded-b-xl"
        >
          {options.map((opt) => (
            <button
              key={opt.value}
              onClick={() => {
                onChange(opt.value);
                setOpen(false);
              }}
              className={`block w-full px-4 py-3 text-left text-sm font-bold
                transition-colors hover:bg-gray-100 
                ${selected === opt.value ? "bg-gray-100" : ""}
              `}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default RegistryDropdown;
