import React from "react";


export default function Controls({
  categories,
  selectedCategory,
  onSelectCategory,
  sortBy,
  onChangeSort,
  viewMode,
  onChangeView
}) {
  return (
    <section className="controls-section">
      <div className="controls-container">
        <div className="category-filters">
          {categories.map((category) => (
            <button
              key={category}
              className={`category-btn ${selectedCategory === category ? "active" : ""}`}
              onClick={() => onSelectCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>


        <div className="controls-right">
          <select
            value={sortBy}
            onChange={(e) => onChangeSort(e.target.value)}
            className="sort-select"
          >
            <option value="name">Sort by Name</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="rating">Highest Rated</option>
          </select>


          <div className="view-toggle">
            <button
              className={`view-btn ${viewMode === "grid" ? "active" : ""}`}
              onClick={() => onChangeView("grid")}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <rect x="3" y="3" width="7" height="7" />
                <rect x="14" y="3" width="7" height="7" />
                <rect x="3" y="14" width="7" height="7" />
                <rect x="14" y="14" width="7" height="7" />
              </svg>
            </button>
            <button
              className={`view-btn ${viewMode === "list" ? "active" : ""}`}
              onClick={() => onChangeView("list")}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <rect x="3" y="6" width="18" height="2" />
                <rect x="3" y="12" width="18" height="2" />
                <rect x="3" y="18" width="18" height="2" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}






