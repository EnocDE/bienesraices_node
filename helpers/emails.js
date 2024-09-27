import nodemailer from "nodemailer"
import "dotenv/config"

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

export const emailRegistro = async (datos) => {
  const {nombre, correo, token} = datos
  const info = await transporter.sendMail({
    from: "BienesRaices bienesraices@mail.com",
    to: correo,
    subject: "Activa tu cuenta en BienesRaices",
    text: `Activa tu cuenta en BienesRaices`,
    html: `
      <p>Hola ${nombre}, te has registrado en <span style="font-weight:bold;">Bienes</span>Raices, para ingresar al sitio necesitas activar tu cuenta haciendo clic en el siguiente enlace: <a href="${process.env.BACKEND_URL}:${process.env.PORT ?? 3000}/auth/confirmar/${token}">confirmar cuenta</a></p>
      <p>Si tu no te registraste en nuestro sitio porfavor ignora este mensaje.</p>
    `,
  });

  console.log("Message sent: %s", info.messageId); 
}

export const emailPassword = async (datos) => {
  const {nombre, correo, token} = datos
  const info = await transporter.sendMail({
    from: "BienesRaices bienesraices@mail.com",
    to: correo,
    subject: "Recupera el acceso a tu cuenta en BienesRaices",
    text: `Recupera el acceso a tu cuenta en BienesRaices`,
    html: `
      <p>Hola ${nombre}, has pedido cambiar tu contraseña en tu cuenta de <span style="font-weight:bold;">Bienes</span>Raices, para hacerlo unicamente debes hacer clic en el siguiente enlace: <a href="${process.env.BACKEND_URL}:${process.env.PORT ?? 3000}/auth/olvide-password/${token}">Cambiar contraseña</a></p>
      <p>Si tu no te registraste en nuestro sitio porfavor ignora este mensaje.</p>
    `,
  });

  console.log("Message sent: %s", info.messageId); 
}