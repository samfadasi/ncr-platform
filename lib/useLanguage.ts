"use client";

import { useState } from "react";
import { translations, Lang } from "./i18n";

export function useLanguage(defaultLang: Lang = "en") {
  const [lang, setLang] = useState<Lang>(defaultLang);

  const toggle = () => {
    setLang((prev) => (prev === "en" ? "ar" : "en"));
  };

  const t = (key: keyof typeof translations.en) => {
    return translations[lang][key] ?? key;
  };

  const isRTL = lang === "ar";

  return {
    lang,
    toggle,
    t,
    isRTL,
  };
}
