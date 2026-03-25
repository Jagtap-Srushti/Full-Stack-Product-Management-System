import { useNavigate, useParams } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import AppContext from "../Context/Context";
import axios from "../axios";

const Product = () => {
  const { id } = useParams();
  const { addToCart, removeFromCart, refreshData } =
    useContext(AppContext);

  const [product, setProduct] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8080/api/product/${id}`
        );
        setProduct(res.data);

        if (res.data.imageName) {
          fetchImage();
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    const fetchImage = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8080/api/product/${id}/image`,
          { responseType: "blob" }
        );
        setImageUrl(URL.createObjectURL(res.data));
      } catch {
        setImageUrl("");
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    addToCart(product);
    alert("Added to cart");
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:8080/api/product/${id}`);
      removeFromCart(id);
      refreshData();
      navigate("/");
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = () => {
    navigate(`/product/update/${id}`);
  };

  // 🔄 Loading
  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center text-gray-400">
        Loading product...
      </div>
    );
  }

  if (!product) return null;

  return (
    <div className="min-h-screen bg-gray-50 pt-20 px-4">
      
      {/* MAIN SECTION */}
      <div className="max-w-7xl mx-auto grid lg:grid-cols-3 gap-8">
        
        {/* IMAGE SECTION */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-md p-4 flex items-center justify-center">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={product.name}
              className="w-full h-[450px] object-contain transition duration-300 hover:scale-105"
            />
          ) : (
            <div className="text-gray-400">No Image Available</div>
          )}
        </div>

        {/* RIGHT PANEL */}
        <div className="bg-white rounded-xl shadow-md p-6 h-fit lg:sticky lg:top-24">
          
          {/* CATEGORY */}
          <p className="text-xs text-gray-400 uppercase tracking-wide">
            {product.category}
          </p>

          {/* NAME */}
          <h1 className="text-2xl font-bold text-gray-900 mt-1">
            {product.name}
          </h1>

          {/* BRAND */}
          <p className="text-sm text-gray-500 mt-1">
            {product.brand}
          </p>

          {/* PRICE */}
          <div className="mt-5 text-3xl font-bold text-black">
            ₹ {product.price}
          </div>

          {/* STOCK */}
          <div
            className={`mt-1 text-sm font-medium ${
              product.stockQuantity > 0
                ? "text-green-600"
                : "text-red-500"
            }`}
          >
            {product.stockQuantity > 0
              ? `In stock (${product.stockQuantity})`
              : "Out of stock"}
          </div>

          {/* DIVIDER */}
          <div className="border-t my-5"></div>

          {/* BUTTONS */}
          <div className="flex flex-col gap-3">
            
            <button
              onClick={handleAddToCart}
              disabled={!product.productAvailable}
              className={`w-full py-3 rounded-md text-sm font-semibold transition ${
                product.productAvailable
                  ? "bg-black text-white hover:bg-gray-800"
                  : "bg-gray-200 text-gray-500 cursor-not-allowed"
              }`}
            >
              Add to Cart
            </button>

            <button
              onClick={handleEdit}
              className="w-full py-2 border border-gray-300 rounded-md text-sm hover:bg-gray-100"
            >
              Edit Product
            </button>

            <button
              onClick={handleDelete}
              className="w-full py-2 border border-red-400 text-red-500 rounded-md text-sm hover:bg-red-50"
            >
              Delete Product
            </button>
          </div>
        </div>
      </div>

      {/* DESCRIPTION */}
      <div className="max-w-7xl mx-auto mt-6 bg-white rounded-xl shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-3">
          Product Description
        </h2>
        <p className="text-gray-600 text-sm leading-relaxed">
          {product.description}
        </p>
      </div>

    </div>
  );
};

export default Product;
