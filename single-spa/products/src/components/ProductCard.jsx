import React from "react";
import RatingStars from "./RatingStars";
import { formatCurrency } from "../utils/formatCurrency";


export default function ProductCard({ product, viewMode, onAddToCart, onOpen }) {
  console.log('ProductCard received:', {
    name: product.name,
    image: product.image,
    hasImage: !!product.image
  });
  return (
    <div className="product-card">
      <div className="product-image" onClick={() => onOpen(product)}>
        <img
          src={product.image} alt={product.name}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
          onError={(e) => {
            console.error('Image failed to load:', product.image);
            
          }}
          onLoad={() => console.log('Image loaded successfully:', product.image)}
        />
        {product.discount > 0 && (
          <span className="discount-badge">-{product.discount}%</span>
        )}
        {product.organic && <span className="organic-badge">Organic</span>}
        {!product.inStock && (
          <div className="out-of-stock-overlay">
            <span>Out of Stock</span>
          </div>
        )}
      </div>


      <div className="product-info">
        <h3 className="product-name" onClick={() => onOpen(product)}>
          {product.name}
        </h3>


        <div className="product-rating">
          <div className="stars">
            <RatingStars rating={product.rating} />
          </div>
          <span className="rating-text">
            {product.rating} ({product.reviews} reviews)
          </span>
        </div>


        <div className="product-pricing">
          <span className="current-price">{formatCurrency(product.price)}</span>
          {product.originalPrice > product.price && (
            <span className="original-price">{formatCurrency(product.originalPrice)}</span>
          )}
        </div>


        <button
          className={`add-to-cart-btn ${!product.inStock ? "disabled" : ""}`}
          onClick={() => onAddToCart(product)}
          disabled={!product.inStock}
        >
          {product.inStock ? "Add to Cart" : "Out of Stock"}
        </button>
      </div>
    </div>
  );
}






