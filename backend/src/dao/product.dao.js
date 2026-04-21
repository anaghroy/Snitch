import productModel from "../models/product.model.js";

export const stockOfVariant = async (productId, variantId) => {
    try {
        if (!variantId || variantId === "base") {
            // Base products do not have explicit stock limits in the current schema
            return Infinity;
        }

        const product = await productModel.findOne({
            _id: productId,
            "variants._id": variantId
        });

        if (!product) return null;

        const variant = product.variants.find(
            variant => variant._id.toString() === variantId
        );
        
        return variant ? variant.stock : null;
    } catch (error) {
        console.error("Error fetching variant stock:", error);
        return null;
    }
}