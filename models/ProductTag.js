const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const ProductTag = sequelize.define(
    "product_tag",
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      product_id: {
        type: DataTypes.INTEGER,
        references: {
          model: "product",
          key: "id",
        },
      },
      tag_id: {
        type: DataTypes.INTEGER,
        references: {
          model: "tag",
          key: "id",
        },
      },
    },
    {
      timestamps: false,
      freezeTableName: true,
      underscored: true,
      modelName: "product_tag",
    }
  );

  return ProductTag;
};
