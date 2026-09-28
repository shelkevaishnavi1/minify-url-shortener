import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Url = sequelize.define(
  "Url",
  {
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    longUrl: {
      type: DataTypes.STRING(2048),
      allowNull: false,
      validate: {
        isUrl: true,
      },
    },
    hashValue: {
      type: DataTypes.STRING(10),
      allowNull: false,
      collate: "ascii_bin", // Binary collation: enforces case-sensitivity ('abc' !== 'ABC')
    },
    expiresAt: {
      type: DataTypes.DATE,
      allowNull: true, // NULL means the URL never expires
    },
  },
  {
    tableName: "urls",
    timestamps: true, // Generates createdAt and updatedAt automatically
    indexes: [
      {
        name: "idx_hash_value_unique",
        unique: true,
        fields: ["hashValue"], // Fast O(1) B-tree lookup for redirects
      },
      {
        name: "idx_expires_at",
        fields: ["expiresAt"], // Useful if you run background cleanup tasks to purge old URLs
      },
    ],
  },
);

export default Url;
