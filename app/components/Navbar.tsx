"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";

export default function Navbar() {
  const { data: session, status } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);
  const loading = status === "loading";

  const handleLogout = () => {
    signOut({ callbackUrl: "/" });
    setMenuOpen(false);
  };

  return (
    <nav className="border-b border-gray-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold text-blue-600">
            Havela
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex md:items-center md:gap-4">
            {loading ? (
              <div className="h-8 w-24 animate-pulse rounded bg-gray-200"></div>
            ) : session ? (
              <>
                <Link
                  href="/publish"
                    className="text-xl rounded-2xl bg-gradient-to-tr from-blue-600 to-blue-400 px-8 py-4 font-extrabold text-white shadow-md transition-all duration-200 hover:bg-blue-700 hover:from-blue-700 hover:to-blue-500 hover:shadow-lg h-14 flex items-center"
                >
                  Publicar Propiedad
                </Link>
                <div className="relative">
                  <button
                    onClick={() => setMenuOpen(!menuOpen)}
                    className="flex items-center gap-3 rounded-xl border border-blue-300 px-5 py-2 bg-white/90 shadow-md transition-all duration-200 hover:bg-blue-50 hover:shadow-lg group"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-tr from-blue-600 to-blue-400 text-white font-bold text-lg shadow group-hover:scale-110 group-hover:ring-2 group-hover:ring-blue-300 transition-transform duration-200">
                      {session.user?.name?.charAt(0).toUpperCase() || "U"}
                    </div>
                    <span className="font-semibold text-gray-800 text-lg group-hover:text-blue-700 transition-colors duration-200">{session.user?.name || session.user?.email}</span>
                  </button>

                  {/* Dropdown */}
                  {menuOpen && (
                    <>
                      <div
                        className="fixed inset-0 z-10"
                        onClick={() => setMenuOpen(false)}
                      ></div>
                      <div className="absolute right-0 mt-2 w-72 rounded-xl bg-white shadow-xl border border-gray-200 z-20 overflow-hidden">
                        <Link
                          href="/my-properties"
                          className="block px-5 py-3 text-base font-bold text-gray-900 hover:bg-blue-50 hover:text-blue-700 transition-colors border-b border-gray-100"
                          onClick={() => setMenuOpen(false)}
                        >
                          Mis Propiedades
                        </Link>
                        <Link
                          href="/favorites"
                          className="block px-5 py-3 text-base font-bold text-gray-900 hover:bg-blue-50 hover:text-blue-700 transition-colors border-b border-gray-100"
                          onClick={() => setMenuOpen(false)}
                        >
                          Guardados
                        </Link>
                        <Link
                          href="/reservations"
                          className="block px-5 py-3 text-base font-bold text-gray-900 hover:bg-blue-50 hover:text-blue-700 transition-colors border-b border-gray-100"
                          onClick={() => setMenuOpen(false)}
                        >
                          Mis Reservas
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="block w-full px-5 py-3 text-left text-base font-bold text-red-600 hover:bg-red-50 transition-colors"
                        >
                          Cerrar Sesión
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="rounded-lg border border-gray-300 px-4 py-2 font-semibold text-gray-700 transition-colors hover:bg-gray-50"
                >
                  Iniciar Sesión
                </Link>
                <Link
                  href="/register"
                  className="rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white transition-colors hover:bg-blue-700"
                >
                  Registrarse
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden rounded-lg p-2 hover:bg-gray-100"
          >
            <svg
              className="h-6 w-6 text-gray-700"
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
                    className="block px-8 py-4 text-xl font-extrabold rounded-2xl bg-gradient-to-tr from-blue-600 to-blue-400 text-white shadow-md transition-all duration-200 hover:bg-blue-700 hover:from-blue-700 hover:to-blue-500 hover:shadow-lg mb-2 h-14 flex items-center"
                    onClick={() => setMenuOpen(false)}
                >
                  Publicar Propiedad
                </Link>
                <Link
                  href="/my-properties"
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                  onClick={() => setMenuOpen(false)}
                >
                  Mis Propiedades
                </Link>
                <Link
                  href="/favorites"
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                  onClick={() => setMenuOpen(false)}
                >
                  Favoritos
                </Link>
                <Link
                  href="/reservations"
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                  onClick={() => setMenuOpen(false)}
                >
                  Mis Reservas
                </Link>
                <button
                  onClick={handleLogout}
                  className="block w-full px-4 py-2 text-left text-red-600 hover:bg-gray-100"
                >
                  Cerrar Sesión
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <Link
                  href="/login"
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                  onClick={() => setMenuOpen(false)}
                >
                  Iniciar Sesión
                </Link>
                <Link
                  href="/register"
                  className="block px-4 py-2 text-blue-600 font-semibold hover:bg-gray-100"
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
