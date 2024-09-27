import { DataTypes, Sequelize } from "sequelize"
import { db } from "../config/db.js"

export const Mensaje = db.define("mensajes",
  {
    "mensaje": {
      type: DataTypes.STRING(200),
      allowNull: false
    },

  }
)