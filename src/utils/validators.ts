export function validarNombre(nombre: string): boolean {
  return nombre.trim().length >= 2;
}

export function validarCorreo(correo: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(correo.trim());
}

export function validarEdad(edad: string): boolean {
  const numero = Number(edad.trim());
  return !isNaN(numero) && Number.isInteger(numero) && numero >= 18 && numero <= 120;
}

export function validarEntrada(entrada: string): boolean {
  return entrada.trim().length > 0;
}