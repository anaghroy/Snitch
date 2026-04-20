import productModel from "../models/product.model.js";
import { uploadFile } from "../services/storage.service.js";

export async function createProduct(req, res) {
  try {
    const { title, description, priceAmount, priceCurrency, brand } = req.body;
    const seller = req.user;

    const uploadedImages = await Promise.all(
      req.files.map(async (file) => {
        return await uploadFile({
          buffer: file.buffer,
          fileName: file.originalname,
          mimetype: file.mimetype,
        });
      }),
    );
    const images = uploadedImages.map((img) => ({
      url: img.url,
    }));
    const product = await productModel.create({
      title,
      description,
      price: { amount: Number(priceAmount), currency: priceCurrency || "INR" },
      images,
      brand,
      category: req.body.category ? [req.body.category] : ["Uncategorized"],
      seller: seller._id,
    });
    res.status(201).json({
      message: "Product created successfully",
      success: true,
      product,
    });
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function getSellerProducts(req, res) {
  const seller = req.user;
  const products = await productModel.find({ seller: seller._id });

  res.status(200).json({
    message: "Products fetched successfully",
    success: true,
    products,
  });
}

export async function getAllProducts(req, res) {
  const products = await productModel.find();

  res.status(200).json({
    message: "Products fetched successfully",
    success: true,
    products,
  });
}

export async function getProductById(req, res) {
  try {
    const product = await productModel.findById(req.params.id);
    if (!product) {
      return res
        .status(404)
        .json({ message: "Product not found", success: false });
    }
    res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    console.error("Error fetching product by ID:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function addProductVariant(req, res) {
  const productId = req.params.productId;

  const product = await productModel.findOne({
    _id: productId,
    seller: req.user._id,
  });

  if (!product) {
    return res.status(404).json({
      message: "Product not found",
      success: false,
    });
  }

  const files = req.files;
  const images = [];
  if (files || files.length !== 0) {
    (
      await Promise.all(
        files.map(async (file) => {
          const image = await uploadFile({
            buffer: file.buffer,
            fileName: file.originalname,
          });
          return image;
        }),
      )
    ).map((image) => images.push(image));
  }

  const price = req.body.priceAmount;
  const stock = req.body.stock;
  const attributes = JSON.parse(req.body.attributes || "{}");

  console.log(price);

  product.variants.push({
    images,
    price: {
      amount: Number(price) || product.price.amount,
      currency: req.body.priceCurrency || product.price.currency,
    },
    stock,
    attributes,
  });

  await product.save();

  return res.status(200).json({
    message: "Product variant added successfully",
    success: true,
    product,
  });
}

export async function getSimilarProducts(req, res) {
  try {
    const productId = req.params.id;
    const currentProduct = await productModel.findById(productId);
    
    if (!currentProduct) {
      return res.status(404).json({ message: "Product not found", success: false });
    }

    const similarProducts = await productModel.find({
      _id: { $ne: productId },
      category: { $in: currentProduct.category }
    }).limit(4);

    res.status(200).json({
      success: true,
      products: similarProducts
    });
  } catch (error) {
    console.error("Error fetching similar products:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function searchProducts(req, res) {
  try {
    const { q } = req.query;
    if (!q || q.trim() === "") {
      return res.status(200).json({ success: true, products: [] });
    }

    const regex = new RegExp(q, "i");

    const products = await productModel.find({
      $or: [
        { title: regex },
        { brand: regex },
        { category: { $in: [regex] } },
        { description: regex }
      ]
    }).limit(10);

    res.status(200).json({
      success: true,
      products
    });
  } catch (error) {
    console.error("Error searching products:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
