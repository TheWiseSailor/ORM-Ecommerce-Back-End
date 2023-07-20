const router = require("express").Router();
const { Tag, Product, ProductTag } = require("../../models");

// The `/api/tags` endpoint

router.get("/", async (req, res) => {
  // find all tags
  // be sure to include its associated Product data and ProductTag data
  try {
    const tagData = await Tag.findAll({
      include: [
        {
          model: Product,
          through: ProductTag,
        },
      ],
    });
    res.status(200).json(tagData);
  } catch (err) {
    res.status(500).json({ message: "Tags not found!" });
  }
});

router.get("/:id", async (req, res) => {
  // find a single tag by its `id`
  // be sure to include its associated Product data and ProductTag data
  try {
    const tagData = await Tag.findByPk(req.params.id, {
      include: [
        {
          model: Product,
          through: ProductTag,
        },
      ],
    });
    if (!tagData) {
      res.status(404).json({ message: "No tag found with this id!" });
      return;
    }
    res.status(200).json(tagData);
  } catch (err) {
    res.status(500).json({ message: "Tag not found!" });
  }
});

router.post("/", async (req, res) => {
  // create a new tag
  try {
    const newTag = await Tag.create(req.body);
    res.status(201).json(newTag);
  } catch (err) {
    res.status(400).json({ message: "Tag creation failed", error: err });
  }
});

router.put("/:id", async (req, res) => {
  // update a tag's name by its `id` value
  try {
    const updatedTag = await Tag.update(
      { tag_name: req.body.tag_name }, // Update the 'tag_name' field
      {
        where: { id: req.params.id }, // Update the tag with the specified 'id'
      }
    );

    if (updatedTag[0] === 0) {
      // 'updatedTag[0] === 0' means no rows were affected, i.e., no tag with the specified 'id' exists
      return res.status(404).json({ message: "No tag found with this id!" });
    }

    res.status(200).json(updatedTag);
  } catch (err) {
    res.status(500).json({ message: "Tag update failed", error: err });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const deletedTag = await Tag.destroy({ where: { id: req.params.id } });

    if (!deletedTag) {
      // 'deletedTag' will be 0 if no tag was found with the specified 'id'
      return res.status(404).json({ message: "No tag found with this id!" });
    }

    res.status(200).json({ message: "Tag deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Tag deletion failed", error: err });
  }
});
module.exports = router;
