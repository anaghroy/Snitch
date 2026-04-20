import { createProduct, getSellerProducts, getAllProducts, getProductById, getSimilarProducts } from "../service/product.api";
import { useDispatch } from "react-redux";
import { setSellerProducts, setAllProducts } from "../state/product.slice";

export const useProduct = () => {
  const dispatch = useDispatch();

  async function handleCreateProduct(formData) {
    const data = await createProduct(formData);
    return data.product;
  }

  async function handleGetSellerProduct() {
    const data = await getSellerProducts();
    dispatch(setSellerProducts(data.products));
    return data.product;
  }

  async function handleGetAllProducts() {
    const data = await getAllProducts();
    dispatch(setAllProducts(data.products));
    return data.products;
  }

  async function handleGetProductById(id) {
    const data = await getProductById(id);
    return data.product;
  }

  async function handleGetSimilarProducts(id) {
    const data = await getSimilarProducts(id);
    return data.products;
  }

  return { handleCreateProduct, handleGetSellerProduct, handleGetAllProducts, handleGetProductById, handleGetSimilarProducts };
};
