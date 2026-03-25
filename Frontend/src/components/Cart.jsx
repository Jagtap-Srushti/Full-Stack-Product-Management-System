import React, { useContext, useState, useEffect } from "react";
import AppContext from "../Context/Context";
import axios from "axios";
import CheckoutPopup from "./CheckoutPopup";

const Cart = () => {
  const { cart, removeFromCart, clearCart } = useContext(AppContext);

  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [coupon, setCoupon] = useState("");
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const res = await axios.get("http://localhost:8080/api/products");
        const ids = res.data.map((p) => p.id);

        const validCart = cart.filter((item) => ids.includes(item.id));

        const itemsWithImages = await Promise.all(
          validCart.map(async (item) => {
            try {
              const imgRes = await axios.get(
                `http://localhost:8080/api/product/${item.id}/image`,
                { responseType: "blob" }
              );
              return {
                ...item,
                imageUrl: URL.createObjectURL(imgRes.data),
              };
            } catch {
              return { ...item, imageUrl: "" };
            }
          })
        );

        setCartItems(itemsWithImages);
      } catch (err) {
        console.error(err);
      }
    };

    if (cart.length) fetchImages();
  }, [cart]);

  useEffect(() => {
    const total = cartItems.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );
    setTotalPrice(total);
  }, [cartItems]);

  // 🎯 Coupon Logic (Frontend only)
  const applyCoupon = () => {
    if (coupon === "SAVE10") {
      setDiscount(totalPrice * 0.1);
    } else if (coupon === "SAVE20") {
      setDiscount(totalPrice * 0.2);
    } else {
      alert("Invalid coupon");
      setDiscount(0);
    }
  };

  const finalPrice = totalPrice - discount;

  const handleIncrease = (id) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id && item.quantity < item.stockQuantity
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  };

  const handleDecrease = (id) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(item.quantity - 1, 1) }
          : item
      )
    );
  };

  const handleRemove = (id) => {
    removeFromCart(id);
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleCheckout = async () => {
    try {
      for (const item of cartItems) {
        const updatedStock = item.stockQuantity - item.quantity;

        const updatedProduct = {
          ...item,
          stockQuantity: updatedStock,
        };

        const formData = new FormData();
        formData.append(
          "product",
          new Blob([JSON.stringify(updatedProduct)], {
            type: "application/json",
          })
        );

        await axios.put(
          `http://localhost:8080/api/product/${item.id}`,
          formData
        );
      }

      clearCart();
      setCartItems([]);
      setShowModal(false);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-24 px-4 md:px-10">
      <div className="max-w-6xl mx-auto">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Shopping Cart</h1>

          {cartItems.length > 0 && (
            <button
              onClick={() => {
                clearCart();
                setCartItems([]);
              }}
              className="text-sm text-red-500 hover:underline"
            >
              Remove All
            </button>
          )}
        </div>

        {/* EMPTY CART */}
        {cartItems.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <p className="text-gray-500 text-lg mb-2">
              Your cart is empty 🛒
            </p>
            <p className="text-sm text-gray-400">
              Add some products to get started
            </p>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">

            {/* LEFT: ITEMS */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-xl shadow-md p-4 flex gap-4 items-center"
                >
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-28 h-28 object-contain bg-gray-50 rounded-lg"
                  />

                  <div className="flex-1">
                    <h2 className="font-semibold">{item.name}</h2>
                    <p className="text-sm text-gray-500">{item.brand}</p>

                    <p className="text-sm mt-1">₹ {item.price}</p>

                    <div className="flex gap-3 mt-3">
                      <button
                        onClick={() => handleDecrease(item.id)}
                        className="px-3 border rounded"
                      >
                        -
                      </button>

                      <span>{item.quantity}</span>

                      <button
                        onClick={() => handleIncrease(item.id)}
                        className="px-3 border rounded"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="font-semibold">
                      ₹ {item.price * item.quantity}
                    </p>

                    <button
                      onClick={() => handleRemove(item.id)}
                      className="text-red-500 text-sm mt-2"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* RIGHT: SUMMARY */}
            <div className="bg-white rounded-xl shadow-md p-6 h-fit sticky top-24">

              <h2 className="font-semibold mb-4">Order Summary</h2>

              {/* COUPON */}
              <div className="flex gap-2 mb-4">
                <input
                  value={coupon}
                  onChange={(e) => setCoupon(e.target.value)}
                  placeholder="Coupon code"
                  className="border px-3 py-2 rounded w-full text-sm"
                />
                <button
                  onClick={applyCoupon}
                  className="bg-gray-200 px-4 rounded text-sm"
                >
                  Apply
                </button>
              </div>

              {/* PRICE DETAILS */}
              <div className="flex justify-between text-sm mb-2">
                <span>Subtotal</span>
                <span>₹ {totalPrice}</span>
              </div>

              {discount > 0 && (
                <div className="flex justify-between text-sm text-green-600 mb-2">
                  <span>Discount</span>
                  <span>- ₹ {discount}</span>
                </div>
              )}

              <div className="border-t my-3"></div>

              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>₹ {finalPrice}</span>
              </div>

              <button
                onClick={() => setShowModal(true)}
                className="w-full mt-6 bg-black text-white py-3 rounded-md hover:bg-gray-800"
              >
                Checkout
              </button>
            </div>
          </div>
        )}
      </div>

      <CheckoutPopup
        show={showModal}
        handleClose={() => setShowModal(false)}
        cartItems={cartItems}
        totalPrice={finalPrice}
        handleCheckout={handleCheckout}
      />
    </div>
  );
};

export default Cart;
