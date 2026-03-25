import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const UpdateProduct = () => {
  const { id } = useParams();

  const [product, setProduct] = useState({});
  const [image, setImage] = useState(null);

  const [updateProduct, setUpdateProduct] = useState({
    id: null,
    name: "",
    description: "",
    brand: "",
    price: "",
    category: "",
    releaseDate: "",
    productAvailable: false,
    stockQuantity: "",
  });

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8080/api/product/${id}`
        );

        setProduct(res.data);
        setUpdateProduct(res.data);

        const imgRes = await axios.get(
          `http://localhost:8080/api/product/${id}/image`,
          { responseType: "blob" }
        );

        const file = new File([imgRes.data], res.data.imageName, {
          type: imgRes.data.type,
        });

        setImage(file);
      } catch (err) {
        console.error(err);
      }
    };

    fetchProduct();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdateProduct({ ...updateProduct, [name]: value });
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("imageFile", image);
    formData.append(
      "product",
      new Blob([JSON.stringify(updateProduct)], {
        type: "application/json",
      })
    );

    try {
      await axios.put(
        `http://localhost:8080/api/product/${id}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      alert("Product updated successfully!");
    } catch (error) {
      console.error(error);
      alert("Failed to update product");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 pt-24 px-4 flex justify-center">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-lg p-6">

        <h1 className="text-2xl font-bold mb-6 text-gray-800">
          Update Product
        </h1>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          {/* Name */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Product Name
            </label>
            <input
              type="text"
              name="name"
              value={updateProduct.name}
              onChange={handleChange}
              className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* Brand */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Brand
            </label>
            <input
              type="text"
              name="brand"
              value={updateProduct.brand}
              onChange={handleChange}
              className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* Description */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={updateProduct.description}
              onChange={handleChange}
              className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* Price */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Price
            </label>
            <input
              type="number"
              name="price"
              value={updateProduct.price}
              onChange={handleChange}
              className="w-full border p-2 rounded-lg"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Category
            </label>
            <select
              name="category"
              value={updateProduct.category}
              onChange={handleChange}
              className="w-full border p-2 rounded-lg"
            >
              <option value="">Select category</option>
              <option value="Laptop">Laptop</option>
              <option value="Headphone">Headphone</option>
              <option value="Mobile">Mobile</option>
              <option value="Electronics">Electronics</option>
              <option value="Toys">Toys</option>
              <option value="Fashion">Fashion</option>
            </select>
          </div>

          {/* Stock */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Stock Quantity
            </label>
            <input
              type="number"
              name="stockQuantity"
              value={updateProduct.stockQuantity}
              onChange={handleChange}
              className="w-full border p-2 rounded-lg"
            />
          </div>

          {/* Release Date */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Release Date
            </label>
            <input
              type="date"
              name="releaseDate"
              value={updateProduct.releaseDate}
              onChange={handleChange}
              className="w-full border p-2 rounded-lg"
            />
          </div>

          {/* Image Preview */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-2">
              Product Image
            </label>

            <img
              src={
                image
                  ? URL.createObjectURL(image)
                  : "https://via.placeholder.com/300"
              }
              alt="preview"
              className="w-full h-48 object-cover rounded-lg mb-3"
            />

            <input
              type="file"
              onChange={handleImageChange}
              className="w-full"
            />
          </div>

          {/* Checkbox */}
          <div className="md:col-span-2 flex items-center gap-2">
            <input
              type="checkbox"
              checked={updateProduct.productAvailable}
              onChange={(e) =>
                setUpdateProduct({
                  ...updateProduct,
                  productAvailable: e.target.checked,
                })
              }
            />
            <label>Product Available</label>
          </div>

          {/* Submit */}
          <div className="md:col-span-2">
            <button
              type="submit"
              className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg font-semibold transition"
            >
              Update Product
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateProduct;
