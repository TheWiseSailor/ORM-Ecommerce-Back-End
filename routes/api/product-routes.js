const router = require("express").Router();
const { Product, Category, Tag, ProductTag } = require("../../models");

// The `/api/products` endpoint

// get all products
router.get("/", async (req, res) => {
  // find all products
  // be sure to include its associated Category and Tag data
  try {
    const products = await Product.findAll({
      include: [
        Category,
        //   as: "category",

        {
          model: Tag,
          through: ProductTag,
        },
      ],
    });

    // const formattedProducts = products.map((product) => {
    //   return {
    //     id: product.id,
    //     product_name: product.product_name,
    //     price: product.price,
    //     stock: product.stock,
    //     category_id: product.category_id,
    //     category: {
    //       id: product.category.id,
    //       category_name: product.category.category_name,
    //     },
    //     tags: product.tags.map((tag) => {
    //       return {
    //         id: tag.id,
    //         tag_name: tag.tag_name,
    //         product_tag: {
    //           id: tag.product_tag.id,
    //           product_id: tag.product_tag.product_id,
    //           tag_id: tag.product_tag.tag_id,
    //         },
    //       };
    //     }),
    //   };
    // });
    res.json(products);
  } catch (err) {
    res.status(500).json(err);
  }
});
// get one product
router.get("/:id", async (req, res) => {
  // find a single product by its `id`
  // be sure to include its associated Category and Tag data
  try {
    const product = await Product.findByPk(req.params.id, {
      include: [
        {
          model: Category,
        },
        {
          model: Tag,
          through: ProductTag, // alias for associated Tags
        },
      ],
    });
    if (!product) {
      res.status(404).json({ message: "Product not found" });
      return;
    }
    // const formattedProduct = {
    //   id: product.id,
    //   product_name: product.product_name,
    //   price: product.price,
    //   stock: product.stock,
    //   category_id: product.category_id,
    //   category: {
    //     id: product.category.id,
    //     category_name: product.category.category_name,
    //   },
    //   tags: product.tags.map((tag) => {
    //     return {
    //       id: tag.id,
    //       tag_name: tag.tag_name,
    //       product_tag: {
    //         id: tag.product_tag.id,
    //         product_id: tag.product_tag.product_id,
    //         tag_id: tag.product_tag.tag_id,
    //       },
    //     };
    //  }),
    //};
    res.json(product);
  } catch (err) {
    res.status(500).json(err);
  }
});

// create new product
router.post("/", async (req, res) => {
  try {
    const newProduct = await Product.create(req.body);
    if (req.body.tagIds && req.body.tagIds.length > 0) {
      const productTagIds = req.body.tagIds.map((tag_id) => ({
        product_id: newProduct.id,
        tag_id,
      }));
      await ProductTag.bulkCreate(productTagIds);
    }
    res.status(201).json(newProduct);
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: "Creation failed", error: err });
  }
});

// update product
router.put("/:id", async (req, res) => {
  try {
    const updatedProduct = await Product.update(req.body, {
      where: {
        id: req.params.id,
      },
    });

    if (req.body.tagIds && req.body.tagIds.length) {
      const productTags = await ProductTag.findAll({
        where: { product_id: req.params.id },
      });

      const productTagIds = productTags.map(({ tag_id }) => tag_id);
      const newProductTags = req.body.tagIds
        .filter((tag_id) => !productTagIds.includes(tag_id))
        .map((tag_id) => {
          return {
            product_id: req.params.id,
            tag_id,
          };
        });

      const productTagsToRemove = productTags
        .filter(({ tag_id }) => !req.body.tagIds.includes(tag_id))
        .map(({ id }) => id);

      await Promise.all([
        ProductTag.destroy({ where: { id: productTagsToRemove } }),
        ProductTag.bulkCreate(newProductTags),
      ]);
    }

    res.json(updatedProduct);
  } catch (err) {
    res.status(400).json(err);
  }
});

router.delete("/:id", async (req, res) => {
  // delete one product by its `id` value
  try {
    const deletedProduct = await Product.destroy({
      where: {
        id: req.params.id,
      },
    });
    res.json(deletedProduct);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
