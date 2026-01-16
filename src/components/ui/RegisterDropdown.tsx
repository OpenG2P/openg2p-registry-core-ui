"use client";

import { useClickOutside } from "@/shared/hooks/useClickOutside";
import { useState, useRef, useEffect } from "react";
import { useTranslations } from 'next-intl';
import { MdOutlineArrowDropDown } from "react-icons/md";

export interface DropdownOption {
  value: string;
  label: string;
}

interface RegisterDropdownProps {
  options: DropdownOption[];
  selected: string;
  onChange: (value: string) => void;
}

const RegisterDropdown = ({
  options,
  selected,
  onChange,
}: RegisterDropdownProps) => {
  const t = useTranslations();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useClickOutside(dropdownRef, () => setOpen(false), open);

  // Auto-select first option
  useEffect(() => {
    if (!selected || !options.some(o => o.value === selected)) {
      if (options.length > 0) {
        onChange(options[0].value);
      }
    }
  }, [selected, options, onChange]);

  const selectedLabel =
    options.find((o) => o.value === selected)?.label || t('select');

  return (
    <div ref={dropdownRef} className="relative min-w-45 -left-0.75 z-10">
      {/* BUTTON */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={`
          flex h-14 w-full items-center justify-between
          rounded-[30px] border border-[#ED7C22] bg-white px-6
          text-sm font-semibold text-gray-800
          transition-colors
          ${open
            ? "rounded-b-none border-b-0"
            : `rounded-r-none border-r-0 after:absolute after:right-0 after:top-1 after:bottom-1 after:w-px after:bg-[#ED7C22] after:content-[''] `}
            `}
      >
        <span className={`truncate text-[18px] ${open ? "text-gray-400" : ""}`}>
          {selectedLabel}
        </span>

        <span
          className={`text-4xl transition-transform duration-200 ${open ? "rotate-180" : ""
            }`}
        >
          <MdOutlineArrowDropDown />
        </span>
      </button>

      {/* DROPDOWN (OVERLAY) */}
      {open && (
        <div
          className="
            absolute w-full z-20
            overflow-hidden rounded-b-[30px] border
            border-t-0 border-[#ED7C22]
            bg-white shadow-lg
          "
        >
          {options.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => {
                onChange(opt.value);
                setOpen(false);
              }}
              className={`
                block w-full px-6 pb-2 text-left
                text-[16px] font-semibold
                transition-colors
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

export default RegisterDropdown;
