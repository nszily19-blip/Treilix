"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";
import NavbarAuth from "./NavbarAuth";
import CookieBanner from "./CookieBanner";

export default function RootShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

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
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 md:px-6">
          <Link href="/" className="flex min-w-0 items-center gap-3">
            <Image
              src="/tx.png"
              alt="Treilix"
              width={40}
              height={40}
              className="h-10 w-10"
              priority
            />
            <span className="truncate text-2xl font-bold tracking-tight text-slate-900">
              Treilix
            </span>
          </Link>

          <nav className="hidden items-center gap-6 md:flex">
            <Link
              href="/"
              className="text-sm font-medium text-slate-600 transition hover:text-slate-900"
            >
              Home
            </Link>
            <Link
              href="/companies"
              className="text-sm font-medium text-slate-600 transition hover:text-slate-900"
            >
              Companies
            </Link>
            <Link
              href="/claim"
              className="text-sm font-medium text-slate-600 transition hover:text-slate-900"
            >
              Claim
            </Link>
            <Link
              href="/add-company"
              className="text-sm font-medium text-slate-600 transition hover:text-slate-900"
            >
              Add Company
            </Link>
          </nav>

          <div className="hidden md:block">
            <NavbarAuth />
          </div>

          <button
            type="button"
            onClick={openMenu}
            className="flex items-center justify-center rounded-2xl border border-slate-200 bg-white p-2.5 text-slate-700 hover:bg-slate-50 md:hidden"
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </header>

      {menuMounted && (
        <>
          <div
            className={`fixed inset-0 z-40 bg-slate-900/30 transition-opacity duration-300 md:hidden ${
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
              <div className="flex items-center gap-3">
                <Image
                  src="/tx.png"
                  alt="Treilix"
                  width={36}
                  height={36}
                  className="h-9 w-9"
                />
                <span className="text-xl font-bold text-slate-900">
                  Treilix
                </span>
              </div>

              <button
                type="button"
                onClick={closeMenu}
                className="flex items-center justify-center rounded-2xl border border-slate-200 bg-white p-2 text-slate-700 hover:bg-slate-50"
                aria-label="Close menu"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-5">
              <div className="flex flex-col gap-2">
                <Link
                  href="/"
                  onClick={closeMenu}
                  className="rounded-2xl px-3 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  Home
                </Link>

                <Link
                  href="/companies"
                  onClick={closeMenu}
                  className="rounded-2xl px-3 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  Companies
                </Link>

                <Link
                  href="/claim"
                  onClick={closeMenu}
                  className="rounded-2xl px-3 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  Claim
                </Link>

                <Link
                  href="/add-company"
                  onClick={closeMenu}
                  className="rounded-2xl px-3 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  Add Company
                </Link>
              </div>

              <div className="my-5 h-px bg-slate-200" />

              <NavbarAuth mobile />
            </div>
          </aside>
        </>
      )}

      <main>{children}</main>

      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-6 md:px-6">
          <p className="text-sm text-slate-600">
            © {new Date().getFullYear()} Treilix. All rights reserved.
          </p>

          <div className="mt-3 flex flex-wrap gap-4 text-sm text-slate-600">
            <Link href="/terms" className="hover:text-slate-900">
              Terms
            </Link>
            <Link href="/privacy" className="hover:text-slate-900">
              Privacy
            </Link>
            <Link href="/imprint" className="hover:text-slate-900">
              Imprint
            </Link>
          </div>
        </div>
      </footer>

      <CookieBanner />
    </>
  );
}