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
  const seller = req.user
  const products = await productModel.find({seller: seller._id})

  res.status(200).json({
    message: "Products fetched successfully",
    success: true,
    products
  })
}
