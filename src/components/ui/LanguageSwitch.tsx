'use client';

import React from 'react';
import { useLanguage } from "@/contexts/LanguageContext";

const languages = [
  { label: "日本語", value: "ja" },
  { label: "English", value: "en" },
] as const;

type LanguageType = typeof languages[number]["value"];

export function LanguageSwitch() {
  const { language, setLanguage } = useLanguage();

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value as LanguageType;
    setLanguage(value);
    localStorage.setItem("language", value);
  };

  return (
    <select
      value={language}
      onChange={handleChange}
      className="bg-transparent border border-gray-300 rounded-md px-2 py-1 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-black"
    >
      {languages.map((lang) => (
        <option key={lang.value} value={lang.value}>
          {lang.label}
        </option>
      ))}
    </select>
  );
}