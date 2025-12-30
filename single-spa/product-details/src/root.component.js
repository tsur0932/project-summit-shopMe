import React, { useState, useEffect } from "react";
import "./product-details.css";
import { productsApi } from "./api";


// Live product data will be fetched from BFF


export default function Root(props) {
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedTab, setSelectedTab] = useState("description");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");


  useEffect(() => {
    // Get product ID from URL
    const pathParts = window.location.pathname.split('/');
    const productId = pathParts[pathParts.length - 1];
   
    let isMounted = true;
    (async () => {
      try {
        const res = await productsApi.getById(productId);
        const data = res?.data ?? res;
        // Map backend fields to UI model with sensible defaults
        const mapped = data && {
          id: data.id || data.product_id || productId,
          name: data.name || "Product",
          category: data.categoryName || data.category || "",
          price: data.price ?? 0,
          originalPrice: data.originalPrice ?? data.price ?? 0,
          image: `/apple.jpg`,
          rating: 4.5,
          reviews: 25,
          discount: 0,
          organic: true,
          inStock: (data.status || "APPROVED") === "APPROVED" && (data.stock_count ?? 1) > 0,
          description: data.description || "Fresh and delicious.",
          nutritionFacts: data.nutritionFacts || {
            calories: 0,
            carbs: "-",
            fiber: "-",
            sugar: "-",
            protein: "-",
            fat: "-",
          },
          benefits: data.benefits || ["Tasty", "Nutritious"],
          origin: data.origin || "Local",
          shelfLife: data.shelfLife || "-",
        };
        if (isMounted) setProduct(mapped);
      } catch (e) {
        console.error("Failed to load product", e);
        setError("Failed to load product");
        if (isMounted) setProduct(null);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    })();
    return () => { isMounted = false; };
  }, []);


  const handleAddToCart = () => {
    if (product) {
      window.dispatchEvent(new CustomEvent('addToCart', {
        detail: { product, quantity }
      }));
     
      // Show success message
      alert(`Added ${quantity} ${product.name} to cart!`);
    }
  };


  const handleBuyNow = () => {
    if (product) {
      handleAddToCart();
      // Navigate to cart
      window.history.pushState({}, "", "/cart");
      window.dispatchEvent(new PopStateEvent("popstate"));
    }
  };


  const handleBackToProducts = () => {
    window.history.pushState({}, "", "/");
    window.dispatchEvent(new PopStateEvent("popstate"));
  };


  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
   
    for (let i = 0; i < fullStars; i++) {
      stars.push(<span key={i} className="star filled">★</span>);
    }
   
    if (hasHalfStar) {
      stars.push(<span key="half" className="star half">★</span>);
    }
   
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<span key={`empty-${i}`} className="star">☆</span>);
    }
   
    return stars;
  };


  if (isLoading) {
    return (
      <div className="product-details-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading product details...</p>
        </div>
      </div>
    );
  }


  if (error) {
    return (
      <div className="product-details-container">
        <div className="product-not-found">
          <h2>Unable to load product</h2>
          <p>{error}</p>
          <button className="back-btn" onClick={handleBackToProducts}>
            Back to Products
          </button>
        </div>
      </div>
    );
  }


  if (!product) {
    return (
      <div className="product-details-container">
        <div className="product-not-found">
          <h2>Product Not Found</h2>
          <p>The product you're looking for doesn't exist.</p>
          <button className="back-btn" onClick={handleBackToProducts}>
            Back to Products
          </button>
        </div>
      </div>
    );
  }


  return (
    <div className="product-details-container">
      <div className="breadcrumb">
        <span onClick={handleBackToProducts} className="breadcrumb-link">Products</span>
        <span className="breadcrumb-separator">›</span>
        <span className="breadcrumb-current">{product.name}</span>
      </div>


      <div className="product-details-content">
        <div className="product-image-section">
          <div className="product-main-image">
            <span className="product-emoji">{product.image}</span>
            {product.discount > 0 && (
              <span className="discount-badge">-{product.discount}%</span>
            )}
            {product.organic && (
              <span className="organic-badge">Organic</span>
            )}
          </div>
        </div>


        <div className="product-info-section">
          <div className="product-header">
            <h1 className="product-title">{product.name}</h1>
            <span className="product-category">{product.category}</span>
           
            <div className="product-rating">
              <div className="stars">
                {renderStars(product.rating)}
              </div>
              <span className="rating-text">
                {product.rating} ({product.reviews} reviews)
              </span>
            </div>
          </div>


          <div className="product-pricing">
            <span className="current-price">${product.price}</span>
            {product.originalPrice > product.price && (
              <span className="original-price">${product.originalPrice}</span>
            )}
            {product.discount > 0 && (
              <span className="savings">Save ${(product.originalPrice - product.price).toFixed(2)}</span>
            )}
          </div>


          <div className="product-actions">
            <div className="quantity-selector">
              <label>Quantity:</label>
              <div className="quantity-controls">
                <button
                  className="quantity-btn"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                >
                  -
                </button>
                <span className="quantity-display">{quantity}</span>
                <button
                  className="quantity-btn"
                  onClick={() => setQuantity(quantity + 1)}
                >
                  +
                </button>
              </div>
            </div>


            <div className="action-buttons">
              <button
                className="add-to-cart-btn"
                onClick={handleAddToCart}
                disabled={!product.inStock}
              >
                {product.inStock ? 'Add to Cart' : 'Out of Stock'}
              </button>
              <button
                className="buy-now-btn"
                onClick={handleBuyNow}
                disabled={!product.inStock}
              >
                Buy Now
              </button>
            </div>
          </div>


          <div className="product-info-tabs">
            <div className="tab-headers">
              <button
                className={`tab-header ${selectedTab === 'description' ? 'active' : ''}`}
                onClick={() => setSelectedTab('description')}
              >
                Description
              </button>
              <button
                className={`tab-header ${selectedTab === 'nutrition' ? 'active' : ''}`}
                onClick={() => setSelectedTab('nutrition')}
              >
                Nutrition
              </button>
              <button
                className={`tab-header ${selectedTab === 'benefits' ? 'active' : ''}`}
                onClick={() => setSelectedTab('benefits')}
              >
                Benefits
              </button>
            </div>


            <div className="tab-content">
              {selectedTab === 'description' && (
                <div className="description-content">
                  <p>{product.description}</p>
                  <div className="product-details-grid">
                    <div className="detail-item">
                      <strong>Origin:</strong> {product.origin}
                    </div>
                    <div className="detail-item">
                      <strong>Shelf Life:</strong> {product.shelfLife}
                    </div>
                    <div className="detail-item">
                      <strong>Category:</strong> {product.category}
                    </div>
                    <div className="detail-item">
                      <strong>Organic:</strong> {product.organic ? 'Yes' : 'No'}
                    </div>
                  </div>
                </div>
              )}


              {selectedTab === 'nutrition' && (
                <div className="nutrition-content">
                  <h3>Nutrition Facts (per 100g)</h3>
                  <div className="nutrition-grid">
                    <div className="nutrition-item">
                      <span className="nutrition-label">Calories</span>
                      <span className="nutrition-value">{product.nutritionFacts.calories}</span>
                    </div>
                    <div className="nutrition-item">
                      <span className="nutrition-label">Carbohydrates</span>
                      <span className="nutrition-value">{product.nutritionFacts.carbs}</span>
                    </div>
                    <div className="nutrition-item">
                      <span className="nutrition-label">Dietary Fiber</span>
                      <span className="nutrition-value">{product.nutritionFacts.fiber}</span>
                    </div>
                    <div className="nutrition-item">
                      <span className="nutrition-label">Sugars</span>
                      <span className="nutrition-value">{product.nutritionFacts.sugar}</span>
                    </div>
                    <div className="nutrition-item">
                      <span className="nutrition-label">Protein</span>
                      <span className="nutrition-value">{product.nutritionFacts.protein}</span>
                    </div>
                    <div className="nutrition-item">
                      <span className="nutrition-label">Fat</span>
                      <span className="nutrition-value">{product.nutritionFacts.fat}</span>
                    </div>
                  </div>
                </div>
              )}


              {selectedTab === 'benefits' && (
                <div className="benefits-content">
                  <h3>Health Benefits</h3>
                  <ul className="benefits-list">
                    {product.benefits.map((benefit, index) => (
                      <li key={index} className="benefit-item">
                        <span className="benefit-icon">✓</span>
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}