import bcrypt from "bcrypt"

export async function hashClave(clave) {
  const salt = await bcrypt.genSalt(10)
  return await bcrypt.hash(clave, salt)
}
