import bcrypt from "bcrypt";
import { DataTypes } from "sequelize";
import { db } from "../config/db.js";
import { hashClave } from "../helpers/hash.js";

export const Usuario = db.define(
  'usuarios',
  {
    "nombre": {
      type: DataTypes.STRING,
      allowNull: false
    },
    "correo": {
      type: DataTypes.STRING,
      allowNull: false
    },
    "clave": {
      type: DataTypes.STRING,
      allowNull: false
    },
    "token": {
      type: DataTypes.STRING,
    },
    "confirmado": {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  }, {
  hooks: {
    beforeCreate: async function (usuario) {
      usuario.clave = await hashClave(usuario.clave)
    }
  },
  scopes: {
    eliminarPassword: {
      attributes: {
        exclude: ["clave", "token", "confirmado", "createdAt", "updatedAt"]
      }
    }
  }
})

Usuario.prototype.verificarClave = function (clave) {
  return bcrypt.compareSync(clave, this.clave)
}
