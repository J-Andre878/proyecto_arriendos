"use client";

import Link from "next/link";
import Navbar from "@/app/components/Navbar";

export default function TermsConditionsPage() {
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
            Términos y Condiciones
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
              Los presentes Términos y Condiciones regulan el acceso y uso de la plataforma digital <span className="font-semibold text-purple-300">Havela</span>.
            </p>
            <p className="text-lg text-gray-100 leading-relaxed mt-4">
              Al registrarse y utilizar la plataforma, el usuario declara haber leído y aceptado estos Términos y Condiciones.
            </p>
          </section>

          {/* Section 1 */}
          <section>
            <h2 className="text-3xl font-bold text-white mb-4">1. Descripción del servicio</h2>
            <p className="text-gray-100 mb-4">
              <span className="font-semibold text-purple-300">Havela</span> es una plataforma digital cuyo objetivo es publicar anuncios de propiedades en arriendo y facilitar el contacto directo entre propietarios e interesados.
            </p>
            <p className="text-gray-100">
              La plataforma no actúa como intermediaria, no gestiona reservas, no procesa pagos y no participa en acuerdos de arriendo.
            </p>
          </section>

          {/* Section 2 */}
          <section>
            <h2 className="text-3xl font-bold text-white mb-4">2. Registro de usuarios</h2>
            <p className="text-gray-100 mb-4">
              Para acceder a determinadas funcionalidades, el usuario debe crear una cuenta proporcionando información básica y veraz.
            </p>
            <p className="text-gray-100 mb-4 font-semibold">El usuario es responsable de:</p>
            <ul className="space-y-2 ml-6 mb-4">
              <li className="text-gray-100 flex items-start">
                <span className="text-purple-400 mr-3">•</span>
                <span>La información que proporciona</span>
              </li>
              <li className="text-gray-100 flex items-start">
                <span className="text-purple-400 mr-3">•</span>
                <span>El uso de su cuenta</span>
              </li>
              <li className="text-gray-100 flex items-start">
                <span className="text-purple-400 mr-3">•</span>
                <span>Las acciones realizadas desde su perfil</span>
              </li>
            </ul>
            <p className="text-gray-100">
              La plataforma podrá suspender o eliminar cuentas en caso de uso indebido o incumplimiento de estos Términos.
            </p>
          </section>

          {/* Section 3 */}
          <section>
            <h2 className="text-3xl font-bold text-white mb-4">3. Publicación de anuncios</h2>
            <p className="text-gray-100 mb-4 font-semibold">Los usuarios que publiquen anuncios declaran que:</p>
            <ul className="space-y-2 ml-6 mb-6">
              <li className="text-gray-100 flex items-start">
                <span className="text-purple-400 mr-3">•</span>
                <span>Cuentan con autorización para publicar el inmueble</span>
              </li>
              <li className="text-gray-100 flex items-start">
                <span className="text-purple-400 mr-3">•</span>
                <span>La información proporcionada es veraz y actualizada</span>
              </li>
              <li className="text-gray-100 flex items-start">
                <span className="text-purple-400 mr-3">•</span>
                <span>Las publicaciones pueden estar sujetas al pago de una tarifa por publicación, la cual será informada antes de completar el proceso</span>
              </li>
            </ul>
            <p className="text-gray-100 mb-4 font-semibold">Havela se reserva el derecho de:</p>
            <ul className="space-y-2 ml-6">
              <li className="text-gray-100 flex items-start">
                <span className="text-purple-400 mr-3">•</span>
                <span>Revisar, modificar o eliminar anuncios</span>
              </li>
              <li className="text-gray-100 flex items-start">
                <span className="text-purple-400 mr-3">•</span>
                <span>Rechazar publicaciones con contenido falso, engañoso, ofensivo o ilegal</span>
              </li>
            </ul>
          </section>

          {/* Section 4 */}
          <section>
            <h2 className="text-3xl font-bold text-white mb-4">4. Relación entre usuarios</h2>
            <p className="text-gray-100 mb-4">
              El contacto, negociación y cualquier acuerdo relacionado con el arriendo de un inmueble se realiza directamente entre las partes involucradas.
            </p>
            <p className="text-gray-100 mb-4 font-semibold">La plataforma no interviene en:</p>
            <ul className="space-y-2 ml-6">
              <li className="text-gray-100 flex items-start">
                <span className="text-purple-400 mr-3">•</span>
                <span>Negociaciones</span>
              </li>
              <li className="text-gray-100 flex items-start">
                <span className="text-purple-400 mr-3">•</span>
                <span>Pagos</span>
              </li>
              <li className="text-gray-100 flex items-start">
                <span className="text-purple-400 mr-3">•</span>
                <span>Condiciones del arriendo</span>
              </li>
              <li className="text-gray-100 flex items-start">
                <span className="text-purple-400 mr-3">•</span>
                <span>Entrega del inmueble</span>
              </li>
            </ul>
          </section>

          {/* Section 5 */}
          <section>
            <h2 className="text-3xl font-bold text-white mb-4">5. Limitación de responsabilidad</h2>
            <p className="text-gray-100 mb-4 font-semibold">Havela:</p>
            <ul className="space-y-2 ml-6 mb-6">
              <li className="text-gray-100 flex items-start">
                <span className="text-purple-400 mr-3">•</span>
                <span>No garantiza la veracidad de los anuncios</span>
              </li>
              <li className="text-gray-100 flex items-start">
                <span className="text-purple-400 mr-3">•</span>
                <span>No verifica la identidad de los usuarios</span>
              </li>
              <li className="text-gray-100 flex items-start">
                <span className="text-purple-400 mr-3">•</span>
                <span>No garantiza la disponibilidad de los inmuebles</span>
              </li>
            </ul>
            <p className="text-gray-100 mb-4 font-semibold">La plataforma no se hace responsable por:</p>
            <ul className="space-y-2 ml-6 mb-6">
              <li className="text-gray-100 flex items-start">
                <span className="text-purple-400 mr-3">•</span>
                <span>Conflictos entre usuarios</span>
              </li>
              <li className="text-gray-100 flex items-start">
                <span className="text-purple-400 mr-3">•</span>
                <span>Pagos realizados fuera de la plataforma</span>
              </li>
              <li className="text-gray-100 flex items-start">
                <span className="text-purple-400 mr-3">•</span>
                <span>Daños, pérdidas o perjuicios derivados de acuerdos entre terceros</span>
              </li>
            </ul>
            <p className="text-gray-100">
              El uso de la plataforma se realiza bajo responsabilidad del usuario.
            </p>
          </section>

          {/* Section 6 */}
          <section>
            <h2 className="text-3xl font-bold text-white mb-4">6. Uso adecuado de la plataforma</h2>
            <p className="text-gray-100 mb-4">
              El usuario se compromete a no utilizar la plataforma para:
            </p>
            <ul className="space-y-2 ml-6 mb-4">
              <li className="text-gray-100 flex items-start">
                <span className="text-purple-400 mr-3">•</span>
                <span>Actividades fraudulentas o ilegales</span>
              </li>
              <li className="text-gray-100 flex items-start">
                <span className="text-purple-400 mr-3">•</span>
                <span>Publicar información falsa o engañosa</span>
              </li>
              <li className="text-gray-100 flex items-start">
                <span className="text-purple-400 mr-3">•</span>
                <span>Afectar el funcionamiento del sitio</span>
              </li>
            </ul>
            <p className="text-gray-100">
              El incumplimiento podrá dar lugar a la suspensión o eliminación de la cuenta.
            </p>
          </section>

          {/* Section 7 */}
          <section>
            <h2 className="text-3xl font-bold text-white mb-4">7. Contenido y propiedad intelectual</h2>
            <p className="text-gray-100 mb-4">
              El contenido propio de <span className="font-semibold text-purple-300">Havela</span> (diseño, estructura, textos, logotipo) pertenece a la plataforma.
            </p>
            <p className="text-gray-100">
              El usuario conserva los derechos sobre el contenido que publica, pero autoriza a la plataforma a mostrarlo dentro del sitio para fines de funcionamiento.
            </p>
          </section>

          {/* Section 8 */}
          <section>
            <h2 className="text-3xl font-bold text-white mb-4">8. Modificaciones del servicio</h2>
            <p className="text-gray-100">
              La plataforma podrá modificar, actualizar o interrumpir total o parcialmente sus servicios en cualquier momento, con o sin previo aviso.
            </p>
          </section>

          {/* Section 9 */}
          <section>
            <h2 className="text-3xl font-bold text-white mb-4">9. Cambios en los Términos y Condiciones</h2>
            <p className="text-gray-100">
              Estos Términos y Condiciones podrán ser actualizados. Las modificaciones se publicarán en esta misma sección y entrarán en vigencia desde su publicación.
            </p>
          </section>

          {/* Section 10 */}
          <section>
            <h2 className="text-3xl font-bold text-white mb-4">10. Contacto</h2>
            <p className="text-gray-100">
              Para consultas relacionadas con estos Términos y Condiciones, el usuario puede comunicarse a través de los canales oficiales de <span className="font-semibold text-purple-300">Havela</span>.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
