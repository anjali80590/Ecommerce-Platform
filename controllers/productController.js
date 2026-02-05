const Product = require("../models/Product");
const Fuse = require("fuse.js");
const { rankProducts } = require("../utils/ranking");
const { normalizeQuery, applyFilters } = require("../utils/queryUtils");

let fuse = null;
let productsCache = [];


exports.addProduct = async (req, res) => {
  try {
    const product = new Product(req.body);
    const saved = await product.save();

    productsCache.push(saved);
    fuse = new Fuse(productsCache, {
      keys: ["title", "description", "tags"],
      threshold: 0.3,
    });

    res.status(201).json({ productId: saved._id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateMetadata = async (req, res) => {
  try {
    const { productId, metadata } = req.body;
    const updated = await Product.findByIdAndUpdate(
      productId,
      { metadata },
      { new: true },
    );
    if (!updated) return res.status(404).json({ error: "Product not found" });

    productsCache = productsCache.map((p) =>
      p._id.toString() === productId ? updated : p,
    );
    fuse = new Fuse(productsCache, {
      keys: ["title", "description", "tags"],
      threshold: 0.3,
    });

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.searchProducts = async (req, res) => {
  try {
    let { query, minPrice, maxPrice, color, ram, storage } = req.query;
    if (!query) return res.status(400).json({ error: "Query is required" });

    query = normalizeQuery(query);

    if (!fuse) {
      productsCache = await Product.find({});
      fuse = new Fuse(productsCache, {
        keys: ["title", "description", "tags"],
        threshold: 0.3,
      });
    }

    let fuseResults = fuse.search(query).map((r) => r.item);
    fuseResults = applyFilters(fuseResults, {
      minPrice,
      maxPrice,
      color,
      ram,
      storage,
    });

    const ranked = rankProducts(fuseResults);

    res.json({ data: ranked });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
