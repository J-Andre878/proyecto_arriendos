"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";

export default function Navbar() {
  const { data: session, status } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const loading = status === "loading";

  const handleLogout = () => {
    signOut({ callbackUrl: "/" });
    setMenuOpen(false);
  };

  // Cerrar menú al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };

    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuOpen]);

  return (
    <nav className="border-b border-purple-500/30 dark:border-purple-500/30 bg-white/10 dark:bg-white/10 backdrop-blur-sm sticky top-0 z-50">
      <div className="mx-auto max-w-[92.5rem] px-3 sm:px-4 lg:px-6">
        <div className="flex h-20 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-4">
            <Image
              src="/logo/havela_logo.jpeg"
              alt="Havela Logo"
              width={50}
              height={50}
              className="rounded-lg"
              priority
            />
            <Link href="/" className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-violet-600 to-cyan-500 dark:from-violet-400 dark:via-purple-400 dark:to-cyan-300 hover:from-purple-700 hover:to-cyan-600 dark:hover:from-violet-300 dark:hover:to-cyan-200 transition-all">
              Havela
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex md:items-center md:gap-2">
            {loading ? (
              <div className="h-8 w-24 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
            ) : session ? (
              <>
                <Link
                  href="/publish"
                  className="text-base rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 dark:from-violet-500 dark:to-cyan-400 px-6 py-3 font-bold text-white shadow-md transition-all duration-200 hover:from-purple-700 hover:to-cyan-600 hover:shadow-lg flex items-center"
                >
                  Publicar Propiedad
                </Link>
                <div className="relative" ref={menuRef}>
                  <button
                    onClick={() => setMenuOpen(!menuOpen)}
                    className="flex items-center gap-3 rounded-lg border border-purple-300 dark:border-purple-700 px-4 py-2 bg-white/10 dark:bg-white/10 shadow-md transition-all duration-200 hover:bg-purple-50 dark:hover:bg-gray-700 hover:shadow-lg group text-base font-semibold"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-purple-600 to-cyan-500 dark:from-violet-500 dark:to-cyan-400 text-white font-bold text-base shadow group-hover:scale-110 group-hover:ring-2 group-hover:ring-purple-300 dark:group-hover:ring-purple-700 transition-transform duration-200">
                      {session.user?.name?.charAt(0).toUpperCase() || "U"}
                    </div>
                    <span className="font-semibold text-gray-800 dark:text-gray-200 text-base group-hover:text-purple-700 dark:group-hover:text-purple-400 transition-colors duration-200">{session.user?.name || session.user?.email}</span>
                  </button>

                  {/* Dropdown */}
                  {menuOpen && (
                    <div className="absolute right-0 mt-2 w-64 rounded-xl bg-purple-950/85 dark:bg-purple-950/90 shadow-xl border border-purple-500/30 dark:border-purple-500/30 z-20 overflow-hidden">
                      <Link
                        href="/my-properties"
                        className="block px-5 py-3 text-base font-semibold text-gray-900 dark:text-gray-200 hover:bg-purple-50 dark:hover:bg-gray-800 hover:text-purple-700 dark:hover:text-purple-400 transition-colors border-b border-gray-100 dark:border-gray-800"
                        onClick={() => setMenuOpen(false)}
                      >
                        Mis Propiedades
                      </Link>
                      <Link
                        href="/favorites"
                        className="block px-5 py-3 text-base font-semibold text-gray-900 dark:text-gray-200 hover:bg-purple-50 dark:hover:bg-gray-800 hover:text-purple-700 dark:hover:text-purple-400 transition-colors border-b border-gray-100 dark:border-gray-800"
                        onClick={() => setMenuOpen(false)}
                      >
                        Guardados
                      </Link>
                      <Link
                        href="/profile"
                        className="block px-5 py-3 text-base font-semibold text-gray-900 dark:text-gray-200 hover:bg-purple-50 dark:hover:bg-gray-800 hover:text-purple-700 dark:hover:text-purple-400 transition-colors border-b border-gray-100 dark:border-gray-800"
                        onClick={() => setMenuOpen(false)}
                      >
                        Editar Perfil
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="block w-full px-5 py-3 text-left text-base font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950 transition-colors"
                      >
                        Cerrar Sesión
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="rounded-lg border border-gray-300 dark:border-gray-600 px-5 py-2 font-bold text-gray-700 dark:text-gray-300 transition-colors hover:bg-gray-50 dark:hover:bg-gray-800 text-base"
                >
                  Iniciar Sesión
                </Link>
                <Link
                  href="/register"
                  className="rounded-lg bg-gradient-to-r from-purple-600 to-cyan-500 dark:from-violet-500 dark:to-cyan-400 px-5 py-2 font-bold text-white transition-all hover:shadow-lg text-base"
                >
                  Registrarse
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <svg
              className="h-6 w-6 text-gray-700 dark:text-gray-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            {session ? (
              <div className="space-y-2">
                <div className="px-4 py-2 font-semibold text-gray-900">
                  {session.user?.name || session.user?.email}
                </div>
                <Link
                  href="/publish"
                  className="block px-5 py-2 text-base font-bold rounded-xl bg-gradient-to-tr from-blue-600 to-blue-400 text-white shadow-md transition-all duration-200 hover:bg-blue-700 hover:from-blue-700 hover:to-blue-500 hover:shadow-lg flex items-center mb-2"
                  onClick={() => setMenuOpen(false)}
                >
                  Publicar Propiedad
                </Link>
                <Link
                  href="/my-properties"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => setMenuOpen(false)}
                >
                  Mis Propiedades
                </Link>
                <Link
                  href="/favorites"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => setMenuOpen(false)}
                >
                  Guardados
                </Link>
                <Link
                  href="/profile"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => setMenuOpen(false)}
                >
                  Editar Perfil
                </Link>
                <button
                  onClick={handleLogout}
                  className="block w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-100"
                >
                  Cerrar Sesión
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <Link
                  href="/login"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => setMenuOpen(false)}
                >
                  Iniciar Sesión
                </Link>
                <Link
                  href="/register"
                  className="block px-4 py-2 text-sm text-blue-600 font-semibold hover:bg-gray-100"
                  onClick={() => setMenuOpen(false)}
                >
                  Registrarse
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
