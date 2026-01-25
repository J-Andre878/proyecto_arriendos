/**
 * Valida un número de teléfono ecuatoriano
 * - Debe tener exactamente 10 dígitos
 * - Debe empezar con 0 o 9
 * 
 * Formatos válidos:
 * - 0999999999 (celular)
 * - 9999999999 (sin el 0)
 * - 07xxxxxxxx (teléfono fijo)
 */

export function validatePhoneNumber(phone: string): {
  isValid: boolean;
  error?: string;
} {
  if (!phone) {
    return {
      isValid: false,
      error: "El número de teléfono es requerido"
    };
  }

  // Remover espacios
  const cleanPhone = phone.trim();

  // Verificar que sea solo dígitos
  if (!/^\d+$/.test(cleanPhone)) {
    return {
      isValid: false,
      error: "El número solo debe contener dígitos"
    };
  }

  // Verificar longitud (10 dígitos, o 9 si empieza sin el 0)
  if (cleanPhone.length === 9 && cleanPhone.startsWith("9")) {
    // Formato sin el 0 inicial: 9xxxxxxxx
    return { isValid: true };
  }

  if (cleanPhone.length !== 10) {
    return {
      isValid: false,
      error: `El número debe tener 10 dígitos (tienes ${cleanPhone.length})`
    };
  }

  // Verificar que empiece con 0 o 9
  if (!cleanPhone.startsWith("0") && !cleanPhone.startsWith("9")) {
    return {
      isValid: false,
      error: "El número debe empezar con 0 o 9"
    };
  }

  // Validar segundo dígito para Ecuador
  // Celulares: 09 (0 en segunda posición)
  // Fijos: 07, 06, 05, 04, 03, 02 (primeros 2 dígitos)
  const firstTwoDigits = cleanPhone.substring(0, 2);
  const validPrefixes = ["09", "07", "06", "05", "04", "03", "02"];

  if (!validPrefixes.includes(firstTwoDigits)) {
    return {
      isValid: false,
      error: "Formato de teléfono ecuatoriano no válido"
    };
  }

  return { isValid: true };
}

/**
 * Normaliza un número de teléfono a formato con 10 dígitos
 */
export function normalizePhoneNumber(phone: string): string {
  const cleanPhone = phone.trim().replace(/\D/g, "");

  // Si tiene 9 dígitos y empieza con 9, agregar 0 al inicio
  if (cleanPhone.length === 9 && cleanPhone.startsWith("9")) {
    return `0${cleanPhone}`;
  }

  return cleanPhone;
}
