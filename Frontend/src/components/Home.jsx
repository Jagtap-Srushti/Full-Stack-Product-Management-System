import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import AppContext from "../Context/Context";
import unplugged from "../assets/unplugged.png";

const Home = ({ selectedCategory }) => {
  const { data, isError, addToCart, refreshData } = useContext(AppContext);
  const [products, setProducts] = useState([]);
  const [isDataFetched, setIsDataFetched] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isDataFetched) {
      refreshData();
      setIsDataFetched(true);
    }
  }, [refreshData, isDataFetched]);


  useEffect(() => {
    if (data && data.length > 0) {
      const fetchImagesAndUpdateProducts = async () => {
        const updatedProducts = await Promise.all(
          data.map(async (product) => {
            try {
              const response = await axios.get(
                `http://localhost:8080/api/product/${product.id}/image`,
                { responseType: "blob" }
              );
              const imageUrl = URL.createObjectURL(response.data);
              return { ...product, imageUrl };
            } catch (error) {
              return {
                ...product,
                imageUrl:
                  "https://via.placeholder.com/300x200?text=No+Image",
              };
            }
          })
        );
        setProducts(updatedProducts);
        setLoading(false);
      };

      fetchImagesAndUpdateProducts();
    } else {
      setLoading(false);
    }
  }, [data]);

  const filteredProducts = selectedCategory
    ? products.filter((product) => product.category === selectedCategory)
    : products;

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh]">
        <img src={unplugged} alt="Error" className="w-24 h-24 mb-4" />
        <h2 className="text-lg font-semibold text-gray-500">
          Something went wrong
        </h2>
      </div>
    );
  }

  return (
    <div className="pt-20 px-6 bg-gray-50 min-h-screen">

      {/* 🔄 Loading */}
      {loading ? (
        <div className="flex justify-center items-center h-[60vh]">
          <h2 className="text-xl font-semibold text-gray-500 animate-pulse">
            Loading products...
          </h2>
        </div>
      ) : filteredProducts.length === 0 ? (

        // ❗ Empty state
        <div className="flex flex-col justify-center items-center h-[60vh]">
          <h2 className="text-xl font-semibold text-gray-500">
            No Products Available
          </h2>
        </div>

      ) : (

        // ✅ Product Grid
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {filteredProducts.map((product) => {
            const { id, brand, name, price, productAvailable, imageUrl } =
              product;

            return (
              <div
                key={id}
                className="bg-white rounded-2xl shadow-md hover:shadow-xl transition duration-300 overflow-hidden group w-[260px]"
              >
                <Link
                  to={`/product/${id}`}
                  className="block !no-underline text-gray-800"
                  style={{ textDecoration: "none" }}
                >

                  {/* Image */}
                  <div className="w-full h-48 md:h-56 bg-gray-100 overflow-hidden rounded-t-2xl">
                    <img
                      src={imageUrl}
                      alt={name}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    />
                  </div>


                  {/* Content */}
                  <div className="p-3">
                    <h2 className="text-sm font-semibold text-gray-800 line-clamp-2">
                      {name}
                    </h2>

                    <p className="text-xs text-gray-400 mt-1">
                      {brand}
                    </p>

                    <div className="flex items-center justify-between mt-2">
                      <span className="text-md font-bold text-gray-900">
                        ₹{price}
                      </span>

                      <span className="text-xs text-yellow-500">
                        ⭐ 4.5
                      </span>
                    </div>
                  </div>

                </Link>

                {/* Button */}
                <div className="px-3 pb-3">
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      addToCart(product);
                    }}
                    disabled={!productAvailable}
                    className={`w-full py-2 rounded-lg text-sm font-medium transition 
        ${productAvailable
                        ? "bg-black text-white hover:bg-gray-800"
                        : "bg-gray-200 text-gray-500 cursor-not-allowed"
                      }`}
                  >
                    {productAvailable ? "Add to Cart" : "Unavailable"}
                  </button>
                </div>
              </div>



            );
          })}
        </div>
      )}
    </div>
  );
};

export default Home;
