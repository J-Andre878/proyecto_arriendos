"use client";

import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-purple-500/30 bg-white/10 dark:bg-white/10 backdrop-blur-sm mt-16">
      <div className="mx-auto max-w-[92.5rem] px-3 py-12 sm:px-4 lg:px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Sección 1: Sobre Havela */}
          <div>
            <h3 className="text-lg font-bold text-white mb-4">Havela</h3>
            <p className="text-gray-300 text-sm leading-relaxed">
              Tu plataforma de confianza para encontrar y publicar alojamientos únicos. Conectamos propietarios e interesados de manera directa y segura.
            </p>
          </div>

          {/* Sección 2: Enlaces Rápidos */}
          <div>
            <h3 className="text-lg font-bold text-white mb-4">Enlaces Rápidos</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-300 hover:text-purple-400 text-sm transition-colors">
                  Inicio
                </Link>
              </li>
              <li>
                <Link href="/search" className="text-gray-300 hover:text-purple-400 text-sm transition-colors">
                  Buscar Propiedades
                </Link>
              </li>
              <li>
                <Link href="/publish" className="text-gray-300 hover:text-purple-400 text-sm transition-colors">
                  Publicar Propiedad
                </Link>
              </li>
            </ul>
          </div>

          {/* Sección 3: Documentos Legales */}
          <div>
            <h3 className="text-lg font-bold text-white mb-4">Documentos Legales</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/privacy-policy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-purple-400 text-sm transition-colors"
                >
                  Política de Privacidad
                </Link>
              </li>
              <li>
                <Link
                  href="/terms-and-conditions"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-purple-400 text-sm transition-colors"
                >
                  Términos y Condiciones
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-purple-500/30 pt-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm">
              © {currentYear} Havela. Todos los derechos reservados.
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <a href="mailto:h4v3l4@gmail.com" className="text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 text-sm" target="_blank" rel="noopener noreferrer">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25H4.5a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-.876 1.797l-7.5 5.625a2.25 2.25 0 01-2.748 0l-7.5-5.625A2.25 2.25 0 012.25 6.993V6.75" />
                </svg>
                h4v3l4@gmail.com
              </a>
              <a href="https://www.facebook.com/profile.php?id=61586834805504" className="text-blue-700 dark:text-blue-400 hover:underline flex items-center gap-1 text-sm" target="_blank" rel="noopener noreferrer">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                  <path d="M22.675 0h-21.35C.595 0 0 .592 0 1.326v21.348C0 23.408.595 24 1.325 24h11.495v-9.294H9.692v-3.622h3.128V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.797.143v3.24l-1.918.001c-1.504 0-1.797.715-1.797 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116C23.406 24 24 23.408 24 22.674V1.326C24 .592 23.406 0 22.675 0" />
                </svg>
                havela
              </a>
              <a href="https://www.instagram.com/havela_com?igsh=bDRob3k5ZThsaW45" className="text-pink-600 dark:text-pink-400 hover:underline flex items-center gap-1 text-sm" target="_blank" rel="noopener noreferrer">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.334 3.608 1.308.974.974 1.246 2.241 1.308 3.608.058 1.266.069 1.646.069 4.85s-.012 3.584-.07 4.85c-.062 1.366-.334 2.633-1.308 3.608-.974.974-2.241 1.246-3.608 1.308-1.266.058-1.646.069-4.85.069s-3.584-.012-4.85-.07c-1.366-.062-2.633-.334-3.608-1.308-.974-.974-1.246-2.241-1.308-3.608C2.175 15.647 2.163 15.267 2.163 12s.012-3.584.07-4.85c.062-1.366.334-2.633 1.308-3.608C4.515 2.567 5.782 2.295 7.148 2.233 8.414 2.175 8.794 2.163 12 2.163zm0-2.163C8.741 0 8.332.013 7.052.072 5.775.131 4.602.425 3.635 1.392 2.668 2.359 2.374 3.532 2.315 4.81 2.256 6.09 2.243 6.5 2.243 12c0 5.5.013 5.91.072 7.19.059 1.278.353 2.451 1.32 3.418.967.967 2.14 1.261 3.418 1.32 1.28.059 1.689.072 7.19.072s5.91-.013 7.19-.072c1.278-.059 2.451-.353 3.418-1.32.967-.967 1.261-2.14 1.32-3.418.059-1.28.072-1.689.072-7.19s-.013-5.91-.072-7.19c-.059-1.278-.353-2.451-1.32-3.418C21.398.425 20.225.131 18.948.072 17.668.013 17.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zm0 10.162a3.999 3.999 0 110-7.998 3.999 3.999 0 010 7.998zm6.406-11.845a1.44 1.44 0 11-2.88 0 1.44 1.44 0 012.88 0z" />
                </svg>
                havela_com
              </a>
            </div>
            <p className="text-gray-400 text-sm">
              Hecho en el <span className="text-purple-400">♥</span> de Loja, Ecuador
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
