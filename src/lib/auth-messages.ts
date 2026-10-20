// Mensajes de Supabase Auth en español. Se traducen por código; si no hay código conocido,
// se muestra un mensaje genérico en lugar del texto en inglés.
const byCode: Record<string, string> = {
  invalid_credentials: "Correo o contraseña incorrectos.",
  email_not_confirmed: "Confirma tu correo antes de iniciar sesión. Revisa tu bandeja de entrada.",
  user_already_exists: "Ya existe una cuenta con ese correo. Inicia sesión.",
  email_exists: "Ya existe una cuenta con ese correo. Inicia sesión.",
  weak_password: "La contraseña es demasiado débil. Usa al menos 8 caracteres combinando letras y números.",
  same_password: "La nueva contraseña debe ser distinta a la anterior.",
  over_email_send_rate_limit: "Se enviaron demasiados correos. Espera unos minutos e inténtalo de nuevo.",
  over_request_rate_limit: "Demasiados intentos. Espera un momento e inténtalo de nuevo.",
  signup_disabled: "El registro de cuentas está desactivado.",
  validation_failed: "Revisa los datos ingresados.",
};

export function authErrorMessage(error: { code?: string; message?: string } | null | undefined): string {
  if (error?.code && byCode[error.code]) return byCode[error.code];
  return "No se pudo completar la operación. Inténtalo de nuevo.";
}
