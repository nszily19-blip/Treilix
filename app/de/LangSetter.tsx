"use client";

import { useEffect } from "react";

export default function LangSetter() {
  useEffect(() => {
    document.documentElement.lang = "de";
    return () => {
      document.documentElement.lang = "en";
    };
  }, []);

  return null;
}
