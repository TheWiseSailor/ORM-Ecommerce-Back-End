// import models
const { Sequelize } = require("sequelize");
const CategoryModel = require("./Category");
const ProductModel = require("./Product");
const TagModel = require("./Tag");
const ProductTagModel = require("./ProductTag");

// Initialize Sequelize with the database connection
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: "localhost",
    dialect: "mysql",
    dialectOptions: {
      decimalNumbers: true,
    },
  }
);

// Initialize the models
const Category = CategoryModel(sequelize, Sequelize);
const Product = ProductModel(sequelize, Sequelize);
const Tag = TagModel(sequelize, Sequelize);
const ProductTag = ProductTagModel(sequelize, Sequelize);

// Set up model associations
Product.belongsTo(Category, { foreignKey: "category_id" });
Category.hasMany(Product, { foreignKey: "category_id" });
Product.belongsToMany(Tag, { through: ProductTag, foreignKey: "product_id" });
Tag.belongsToMany(Product, { through: ProductTag, foreignKey: "tag_id" });

// Export the models
module.exports = {
  Category,
  Product,
  Tag,
  ProductTag,
};
