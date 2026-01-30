"use client";

import Link from "next/link";
import Navbar from "@/app/components/Navbar";

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-purple-950 to-gray-950">
      <Navbar />

      <main className="mx-auto max-w-[92.5rem] px-3 py-12 sm:px-4 lg:px-6">
        {/* Header */}
        <div className="mb-12">
          <Link href="/" className="text-purple-400 hover:text-purple-300 mb-4 inline-block">
            ← Volver al inicio
          </Link>
          <h1 className="text-5xl font-bold text-white mt-4">
            Política de Privacidad
          </h1>
          <p className="mt-4 text-xl text-gray-300">
            Última actualización: 29 de enero de 2026
          </p>
        </div>

        {/* Content */}
        <div className="rounded-2xl bg-white/10 backdrop-blur-sm p-8 shadow-xl border border-purple-500/30 space-y-8">
          {/* Introduction */}
          <section>
            <p className="text-lg text-gray-100 leading-relaxed">
              La presente Política de Privacidad describe la forma en que <span className="font-semibold text-purple-300">Havela</span> recopila, utiliza y protege la información personal de los usuarios que acceden y utilizan nuestros servicios.
            </p>
            <p className="text-lg text-gray-100 leading-relaxed mt-4">
              Al registrarse o utilizar esta plataforma, el usuario acepta los términos descritos en esta Política de Privacidad.
            </p>
          </section>

          {/* Section 1 */}
          <section>
            <h2 className="text-3xl font-bold text-white mb-4">1. Información que recopilamos</h2>
            <p className="text-gray-100 mb-4">
              Recopilamos únicamente la información necesaria para el funcionamiento de la plataforma, entre la cual puede incluirse:
            </p>
            <ul className="space-y-2 ml-6">
              <li className="text-gray-100 flex items-start">
                <span className="text-purple-400 mr-3">•</span>
                <span>Nombre y apellido</span>
              </li>
              <li className="text-gray-100 flex items-start">
                <span className="text-purple-400 mr-3">•</span>
                <span>Correo electrónico</span>
              </li>
              <li className="text-gray-100 flex items-start">
                <span className="text-purple-400 mr-3">•</span>
                <span>Número de teléfono o WhatsApp</span>
              </li>
              <li className="text-gray-100 flex items-start">
                <span className="text-purple-400 mr-3">•</span>
                <span>Información de perfil (fotografía, biografía)</span>
              </li>
              <li className="text-gray-100 flex items-start">
                <span className="text-purple-400 mr-3">•</span>
                <span>Información relacionada con las propiedades publicadas (descripción, imágenes, ubicación, amenidades)</span>
              </li>
              <li className="text-gray-100 flex items-start">
                <span className="text-purple-400 mr-3">•</span>
                <span>Información técnica básica (dirección IP, tipo de navegador, dispositivo, cookies)</span>
              </li>
            </ul>
            <p className="text-gray-100 mt-4 font-semibold">
              No recopilamos información bancaria ni datos sensibles adicionales.
            </p>
          </section>

          {/* Section 2 */}
          <section>
            <h2 className="text-3xl font-bold text-white mb-4">2. Uso de la información</h2>
            <p className="text-gray-100 mb-4">
              La información recopilada se utiliza exclusivamente para:
            </p>
            <ul className="space-y-2 ml-6">
              <li className="text-gray-100 flex items-start">
                <span className="text-purple-400 mr-3">•</span>
                <span>Permitir el registro y gestión de cuentas de usuario</span>
              </li>
              <li className="text-gray-100 flex items-start">
                <span className="text-purple-400 mr-3">•</span>
                <span>Publicar y mostrar anuncios de propiedades en disponibilidad</span>
              </li>
              <li className="text-gray-100 flex items-start">
                <span className="text-purple-400 mr-3">•</span>
                <span>Facilitar el contacto directo entre propietarios e interesados</span>
              </li>
              <li className="text-gray-100 flex items-start">
                <span className="text-purple-400 mr-3">•</span>
                <span>Enviar notificaciones relacionadas con el uso de la plataforma</span>
              </li>
              <li className="text-gray-100 flex items-start">
                <span className="text-purple-400 mr-3">•</span>
                <span>Mejorar la experiencia y funcionamiento del sitio</span>
              </li>
              <li className="text-gray-100 flex items-start">
                <span className="text-purple-400 mr-3">•</span>
                <span>Cumplir con obligaciones legales y regulatorias</span>
              </li>
            </ul>
            <p className="text-gray-100 mt-4 font-semibold">
              Havela no vende, alquila ni comparte datos personales con terceros con fines comerciales.
            </p>
          </section>

          {/* Section 3 */}
          <section>
            <h2 className="text-3xl font-bold text-white mb-4">3. Contacto entre usuarios</h2>
            <p className="text-gray-100 leading-relaxed">
              La plataforma Havela actúa únicamente como un medio de contacto entre propietarios y personas interesadas en arrendar un inmueble.
            </p>
            <p className="text-gray-100 leading-relaxed mt-4">
              Los acuerdos, negociaciones, pagos y condiciones del arriendo se realizan directamente entre las partes, sin intervención de la plataforma. Havela no es responsable de las transacciones o acuerdos realizados entre usuarios.
            </p>
          </section>

          {/* Section 4 */}
          <section>
            <h2 className="text-3xl font-bold text-white mb-4">4. Protección de la información</h2>
            <p className="text-gray-100 mb-4">
              Adoptamos medidas técnicas y organizativas razonables para proteger la información personal de los usuarios, incluyendo:
            </p>
            <ul className="space-y-2 ml-6">
              <li className="text-gray-100 flex items-start">
                <span className="text-purple-400 mr-3">•</span>
                <span>Uso de conexiones seguras (HTTPS)</span>
              </li>
              <li className="text-gray-100 flex items-start">
                <span className="text-purple-400 mr-3">•</span>
                <span>Protección de contraseñas mediante encriptación</span>
              </li>
              <li className="text-gray-100 flex items-start">
                <span className="text-purple-400 mr-3">•</span>
                <span>Acceso limitado a la información personal</span>
              </li>
              <li className="text-gray-100 flex items-start">
                <span className="text-purple-400 mr-3">•</span>
                <span>Políticas de confidencialidad para empleados</span>
              </li>
            </ul>
            <p className="text-gray-100 mt-4">
              Sin embargo, el usuario reconoce que ningún sistema es completamente seguro y que el uso de internet conlleva ciertos riesgos inherentes.
            </p>
          </section>

          {/* Section 5 */}
          <section>
            <h2 className="text-3xl font-bold text-white mb-4">5. Responsabilidad</h2>
            <p className="text-gray-100 mb-4">
              Havela no garantiza la veracidad de los anuncios publicados ni la identidad de los usuarios. No nos hacemos responsables por:
            </p>
            <ul className="space-y-2 ml-6">
              <li className="text-gray-100 flex items-start">
                <span className="text-purple-400 mr-3">•</span>
                <span>Daños, pérdidas o conflictos derivados de acuerdos entre usuarios</span>
              </li>
              <li className="text-gray-100 flex items-start">
                <span className="text-purple-400 mr-3">•</span>
                <span>Pagos o transacciones realizadas fuera de la plataforma</span>
              </li>
              <li className="text-gray-100 flex items-start">
                <span className="text-purple-400 mr-3">•</span>
                <span>Información proporcionada por terceros</span>
              </li>
              <li className="text-gray-100 flex items-start">
                <span className="text-purple-400 mr-3">•</span>
                <span>Fraude, suplantación de identidad o comportamiento ilegal de usuarios</span>
              </li>
            </ul>
          </section>

          {/* Section 6 */}
          <section>
            <h2 className="text-3xl font-bold text-white mb-4">6. Derechos del usuario</h2>
            <p className="text-gray-100 mb-4">
              El usuario puede:
            </p>
            <ul className="space-y-2 ml-6">
              <li className="text-gray-100 flex items-start">
                <span className="text-purple-400 mr-3">•</span>
                <span>Solicitar la actualización o corrección de su información personal</span>
              </li>
              <li className="text-gray-100 flex items-start">
                <span className="text-purple-400 mr-3">•</span>
                <span>Solicitar la eliminación de su cuenta y datos asociados</span>
              </li>
              <li className="text-gray-100 flex items-start">
                <span className="text-purple-400 mr-3">•</span>
                <span>Cancelar su cuenta en cualquier momento</span>
              </li>
              <li className="text-gray-100 flex items-start">
                <span className="text-purple-400 mr-3">•</span>
                <span>Acceder a su información personal almacenada</span>
              </li>
            </ul>
            <p className="text-gray-100 mt-4">
              Para ejercer estos derechos, puedes contactarnos a través de tu perfil en la plataforma o mediante los canales indicados en la sección de contacto.
            </p>
          </section>

          {/* Section 7 */}
          <section>
            <h2 className="text-3xl font-bold text-white mb-4">7. Cambios en la política de privacidad</h2>
            <p className="text-gray-100">
              Nos reservamos el derecho de modificar esta Política de Privacidad en cualquier momento. Los cambios serán publicados en esta misma sección y entrarán en vigencia desde su publicación. Es responsabilidad del usuario revisar periódicamente esta página para estar informado de cualquier cambio.
            </p>
          </section>

          {/* Section 8 */}
          <section>
            <h2 className="text-3xl font-bold text-white mb-4">8. Contacto</h2>
            <p className="text-gray-100 mb-4">
              Si tienes dudas o consultas sobre esta Política de Privacidad, puedes contactarnos:
            </p>
            <ul className="space-y-2 ml-6">
              <li className="text-gray-100 flex items-start">
                <span className="text-purple-400 mr-3">•</span>
                <span>A través de tu perfil en la plataforma Havela</span>
              </li>
              <li className="text-gray-100 flex items-start">
                <span className="text-purple-400 mr-3">•</span>
                <span>Por correo electrónico desde tu cuenta registrada</span>
              </li>
              <li className="text-gray-100 flex items-start">
                <span className="text-purple-400 mr-3">•</span>
                <span>A través del formulario de contacto disponible en la plataforma</span>
              </li>
            </ul>
          </section>

          {/* Back Button */}
          <div className="pt-8 border-t border-purple-500/30">
            <Link
              href="/register"
              className="inline-block rounded-lg bg-gradient-to-r from-purple-600 to-cyan-500 px-8 py-3 font-semibold text-white transition-colors hover:from-purple-700 hover:to-cyan-600"
            >
              ← Volver al Registro
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
