import React, { useState, useEffect } from "react";
import "./cart.css";
import { cartApi } from "./api";

export default function Root() {
  const [cartItems, setCartItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [promoCode, setPromoCode] = useState("");
  const [appliedPromo, setAppliedPromo] = useState(null);
  const [cartId, setCartId] = useState(null);

  // Mock promo codes
  const promoCodes = {
    FRESH10: { discount: 10, type: "percentage" },
    SAVE5: { discount: 5, type: "fixed" },
    ORGANIC15: { discount: 15, type: "percentage" },
  };

  // 🔁 Load cart from BFF
  useEffect(() => {
    async function loadCart() {
      setIsLoading(true);
      try {
        const userCart = await cartApi.getUserCart("me");
        const cid = userCart?.id ?? userCart?.data?.id;
        if (cid) {
          setCartId(cid);
          const details = await cartApi.getCartDetails(cid);
          const data = details?.data ?? details;
          const items = (data?.items || []).map((it) => ({
            id: it.product?.id ?? it.productId ?? it.product_id,
            name: it.product?.name ?? it.name ?? "",
            category: it.product?.category ?? it.category ?? "",
            price: it.product?.price ?? it.price ?? 0,
            image: "🥬",
            rating: 4.5,
            reviews: 25,
            discount: 0,
            organic: true,
            quantity: it.quantity ?? 1,
          }));
          setCartItems(items);
        } else {
          setCartItems([]);
        }
      } catch (err) {
        console.error("Error loading cart:", err);
        setCartItems([]);
      } finally {
        setIsLoading(false);
      }
    }

    loadCart();

    // 🔁 Re-fetch when products are added
    window.addEventListener("cartUpdated", loadCart);
    return () => window.removeEventListener("cartUpdated", loadCart);
  }, []);

  const updateQuantity = async (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }

    if (!cartId) return;

    setIsLoading(true);
    try {
      // Just re-add the updated quantity
      await cartApi.addItem(cartId, productId, newQuantity);
      const details = await cartApi.getCartDetails(cartId);
      const data = details?.data ?? details;
      const items = (data?.items || []).map((it) => ({
        id: it.product?.id ?? it.productId,
        name: it.product?.name ?? it.name,
        category: it.product?.category ?? "",
        price: it.product?.price ?? 0,
        image: "🥬",
        quantity: it.quantity ?? 1,
      }));
      setCartItems(items);
    } catch (err) {
      console.error("Error updating quantity:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const removeFromCart = async (productId) => {
    if (!cartId) return;

    setIsLoading(true);
    try {
      // Simulate remove: set quantity = 0
      await cartApi.addItem(cartId, productId, 0);
      const details = await cartApi.getCartDetails(cartId);
      const data = details?.data ?? details;
      const items = (data?.items || []).map((it) => ({
        id: it.product?.id ?? it.productId,
        name: it.product?.name ?? it.name,
        category: it.product?.category ?? "",
        price: it.product?.price ?? 0,
        image: "🥬",
        quantity: it.quantity ?? 1,
      }));
      setCartItems(items);
    } catch (err) {
      console.error("Error removing item:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const applyPromoCode = () => {
    const promo = promoCodes[promoCode.toUpperCase()];
    if (promo) {
      setAppliedPromo({ code: promoCode.toUpperCase(), ...promo });
      setPromoCode("");
    } else {
      alert("Invalid promo code");
    }
  };

  const removePromoCode = () => setAppliedPromo(null);

  const calculateSubtotal = () =>
    cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

  const calculateDiscount = () => {
    if (!appliedPromo) return 0;
    const subtotal = calculateSubtotal();
    return appliedPromo.type === "percentage"
      ? (subtotal * appliedPromo.discount) / 100
      : Math.min(appliedPromo.discount, subtotal);
  };

  const subtotal = calculateSubtotal();
  const discount = calculateDiscount();
  const shipping = subtotal > 50 ? 0 : 5.99;
  const total = subtotal - discount + shipping;

  const handleCheckout = () => {
    setIsLoading(true);
    setTimeout(() => {
      alert(`Order placed successfully! Total: $${total.toFixed(2)}`);
      setCartItems([]);
      setAppliedPromo(null);
      setIsLoading(false);
      window.history.pushState({}, "", "/");
      window.dispatchEvent(new PopStateEvent("popstate"));
    }, 2000);
  };

  if (cartItems.length === 0) {
    return (
      <div className="cart-container">
        <div className="empty-cart">
          <div className="empty-cart-icon">🛒</div>
          <h2>Your cart is empty</h2>
          <p>Add some fresh fruits and vegetables to get started!</p>
          <button
            className="continue-shopping-btn"
            onClick={() => {
              window.history.pushState({}, "", "/");
              window.dispatchEvent(new PopStateEvent("popstate"));
            }}
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-container">
      <div className="cart-header">
        <h1>Shopping Cart</h1>
        <span className="item-count">{cartItems.length} items</span>
      </div>

      <div className="cart-content">
        <div className="cart-items">
          {cartItems.map((item) => (
            <div key={item.id} className="cart-item">
              <div className="item-image">
                <span className="item-emoji">{item.image}</span>
              </div>

              <div className="item-details">
                <h3 className="item-name">{item.name}</h3>
                <p className="item-category">{item.category}</p>
                {item.organic && <span className="organic-tag">Organic</span>}
              </div>

              <div className="item-quantity">
                <button
                  className="quantity-btn"
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                >
                  -
                </button>
                <span className="quantity">{item.quantity}</span>
                <button
                  className="quantity-btn"
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                >
                  +
                </button>
              </div>

              <div className="item-price">
                <span className="price">
                  ${(item.price * item.quantity).toFixed(2)}
                </span>
                <span className="unit-price">${item.price} each</span>
              </div>

              <button
                className="remove-btn"
                onClick={() => removeFromCart(item.id)}
              >
                🗑
              </button>
            </div>
          ))}
        </div>

        <div className="cart-summary">
          <div className="promo-section">
            <h3>Promo Code</h3>
            <div className="promo-input">
              <input
                type="text"
                placeholder="Enter promo code"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && applyPromoCode()}
              />
              <button onClick={applyPromoCode}>Apply</button>
            </div>

            {appliedPromo && (
              <div className="applied-promo">
                <span className="promo-code">{appliedPromo.code}</span>
                <span className="promo-discount">
                  -
                  {appliedPromo.type === "percentage"
                    ? `${appliedPromo.discount}%`
                    : `$${appliedPromo.discount}`}
                </span>
                <button className="remove-promo" onClick={removePromoCode}>
                  ×
                </button>
              </div>
            )}
          </div>

          <div className="order-summary">
            <h3>Order Summary</h3>
            <div className="summary-line">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            {appliedPromo && (
              <div className="summary-line discount">
                <span>Discount ({appliedPromo.code})</span>
                <span>-${discount.toFixed(2)}</span>
              </div>
            )}
            <div className="summary-line">
              <span>Shipping</span>
              <span>
                {shipping === 0 ? (
                  <span className="free-shipping">FREE</span>
                ) : (
                  `$${shipping.toFixed(2)}`
                )}
              </span>
            </div>
            {subtotal < 50 && (
              <div className="shipping-notice">
                Add ${(50 - subtotal).toFixed(2)} more for free shipping!
              </div>
            )}
            <div className="summary-line total">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
            <button
              className={`checkout-btn ${isLoading ? "loading" : ""}`}
              onClick={handleCheckout}
              disabled={isLoading}
            >
              {isLoading ? "Processing..." : "Proceed to Checkout"}
            </button>
            <button
              className="continue-shopping-btn"
              onClick={() => {
                window.history.pushState({}, "", "/");
                window.dispatchEvent(new PopStateEvent("popstate"));
              }}
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
