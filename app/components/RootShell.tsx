"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";
import NavbarAuth from "./NavbarAuth";
import CookieBanner from "./CookieBanner";
import LanguageSwitcher from "./LanguageSwitcher";

export default function RootShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isDE = pathname.startsWith("/de");

  const navLinks = isDE
    ? [
        { href: "/de", label: "Start" },
        { href: "/de/companies", label: "Unternehmen" },
        { href: "/de/claim", label: "Beanspruchen" },
        { href: "/de/add-company", label: "Eintragen" },
      ]
    : [
        { href: "/", label: "Home" },
        { href: "/companies", label: "Companies" },
        { href: "/claim", label: "Claim" },
        { href: "/add-company", label: "Add Company" },
      ];

  const isActive = (href: string) => {
    if (href === "/" || href === "/de") return pathname === href;
    return pathname.startsWith(href);
  };

  const [menuMounted, setMenuMounted] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);

  const openMenu = () => {
    setMenuMounted(true);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setMenuVisible(true);
      });
    });
  };

  const closeMenu = () => {
    setMenuVisible(false);
  };

  useEffect(() => {
    if (!menuVisible && menuMounted) {
      const timer = window.setTimeout(() => {
        setMenuMounted(false);
      }, 280);

      return () => window.clearTimeout(timer);
    }
  }, [menuVisible, menuMounted]);

  useEffect(() => {
    closeMenu();
  }, [pathname]);

  useEffect(() => {
    if (menuMounted) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [menuMounted]);

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 md:px-6">
          <Link href={isDE ? "/de" : "/"} className="flex min-w-0 items-center gap-2.5">
            <Image
              src="/tx.png"
              alt="Treilix"
              width={36}
              height={36}
              className="h-9 w-9"
              priority
            />
            <span className="truncate text-xl font-bold tracking-tight text-slate-900">
              Treilix
            </span>
          </Link>

          <nav className="hidden items-center gap-0.5 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-150 ${
                  isActive(link.href)
                    ? "bg-blue-50 text-blue-600"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="hidden items-center gap-3 md:flex">
            <LanguageSwitcher />
            <NavbarAuth />
          </div>

          <button
            type="button"
            onClick={openMenu}
            className="flex items-center justify-center rounded-xl border border-slate-200 bg-white p-2.5 text-slate-700 transition-colors duration-150 hover:bg-slate-50 md:hidden"
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </header>

      {menuMounted && (
        <>
          <div
            className={`fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm transition-opacity duration-300 md:hidden ${
              menuVisible ? "opacity-100" : "pointer-events-none opacity-0"
            }`}
            onClick={closeMenu}
          />

          <aside
            className={`fixed right-0 top-0 z-50 flex h-full w-[88%] max-w-sm flex-col border-l border-slate-200 bg-white shadow-2xl transition-transform duration-300 ease-out md:hidden ${
              menuVisible ? "translate-x-0" : "translate-x-full"
            }`}
            aria-hidden={!menuVisible}
          >
            <div className="flex items-center justify-between border-b border-slate-200 px-4 py-4">
              <div className="flex items-center gap-2.5">
                <Image
                  src="/tx.png"
                  alt="Treilix"
                  width={32}
                  height={32}
                  className="h-8 w-8"
                />
                <span className="text-lg font-bold text-slate-900">
                  Treilix
                </span>
              </div>

              <button
                type="button"
                onClick={closeMenu}
                className="flex items-center justify-center rounded-xl border border-slate-200 bg-white p-2 text-slate-700 transition-colors duration-150 hover:bg-slate-50"
                aria-label="Close menu"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-5">
              <div className="flex flex-col gap-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={closeMenu}
                    className={`rounded-xl px-3 py-3 text-sm font-medium transition-colors duration-150 ${
                      isActive(link.href)
                        ? "bg-blue-50 text-blue-600"
                        : "text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>

              <div className="my-5 h-px bg-slate-200" />

              <div className="flex justify-center">
                <LanguageSwitcher />
              </div>

              <div className="my-5 h-px bg-slate-200" />

              <NavbarAuth mobile />
            </div>
          </aside>
        </>
      )}

      <main>{children}</main>

      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-10 md:px-6">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-[1fr_auto_auto]">
            <div>
              <Link href={isDE ? "/de" : "/"} className="flex items-center gap-2">
                <Image src="/tx.png" alt="Treilix" width={28} height={28} className="h-7 w-7" />
                <span className="font-bold text-slate-900">Treilix</span>
              </Link>
              <p className="mt-2 max-w-xs text-sm text-slate-500">
                {isDE
                  ? "Das europäische Verzeichnis für Transport- und Logistikunternehmen."
                  : "The European directory for transport and logistics companies."}
              </p>
            </div>

            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
                {isDE ? "Navigation" : "Navigate"}
              </p>
              <div className="flex flex-col gap-2">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-sm text-slate-600 transition-colors duration-150 hover:text-slate-900"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>

            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
                {isDE ? "Rechtliches" : "Legal"}
              </p>
              <div className="flex flex-col gap-2">
                <Link
                  href={isDE ? "/de/terms" : "/terms"}
                  className="text-sm text-slate-600 transition-colors duration-150 hover:text-slate-900"
                >
                  {isDE ? "Nutzungsbedingungen" : "Terms"}
                </Link>
                <Link
                  href={isDE ? "/de/privacy" : "/privacy"}
                  className="text-sm text-slate-600 transition-colors duration-150 hover:text-slate-900"
                >
                  {isDE ? "Datenschutz" : "Privacy"}
                </Link>
                <Link
                  href={isDE ? "/de/imprint" : "/imprint"}
                  className="text-sm text-slate-600 transition-colors duration-150 hover:text-slate-900"
                >
                  {isDE ? "Impressum" : "Imprint"}
                </Link>
              </div>
            </div>
          </div>

          <div className="mt-8 border-t border-slate-200 pt-6">
            <p className="text-sm text-slate-500">
              © {new Date().getFullYear()} Treilix.{" "}
              {isDE ? "Alle Rechte vorbehalten." : "All rights reserved."}
            </p>
          </div>
        </div>
      </footer>

      <CookieBanner />
    </>
  );
}
