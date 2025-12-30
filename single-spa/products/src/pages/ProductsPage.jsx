import React, { useEffect, useState } from "react";
import Hero from "../components/Hero";
import Controls from "../components/Controls";
import ProductCard from "../components/ProductCard";
import { productsApi } from "../services/api";
import { cartApi } from "../services/api";
// import banana from "./../assets/banana.jpg";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([{ id: "all", name: "All" }]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("name");
  const [viewMode, setViewMode] = useState("grid");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showAllProducts, setShowAllProducts] = useState(false);

  const normalize = (str) =>
  str.toLowerCase().replace(/[^a-z0-9]/g, ""); 

  const productImages = {
    apple: 'https://www.waangoo.com/cdn/shop/products/0020895_fresh-red-apples.jpg',
    banana: 'https://mana.md/wp-content/uploads/2021/11/banana-1025109_1280.jpg',
    curryleaves: 'https://avimeeherbal.com/cdn/shop/articles/fresh-curry-leaves_480x480_7fb89629-a7b9-4dc6-916d-3d75152a3f2d.png',
    guava:'https://www.healthxchange.sg/adobe/dynamicmedia/deliver/dm-aid--be2a0a76-477a-4c1f-965e-b6efff8ac5b1/guava-health-benefits-b.jpg',
    beans: 'https://straitsmarket.com/wp-content/uploads/2015/07/french-beans-700x768.jpg',
    pumpkin: 'https://www.wmart.com.my/wp-content/uploads/2022/10/Website-Products-10.2022.jpg',
    strawberry: 'https://4.imimg.com/data4/WH/PJ/MY-30327862/red-strawberry-500x500.jpg'
  };

  useEffect(() => {
    let isMounted = true;
    (async () => {
      setLoading(true);
      try {
        const catRes = await productsApi.getCategories();
        const catData = catRes?.data ?? catRes ?? [];

        const prodRes = await productsApi.getAllProducts?.();
        const fetchedProducts = prodRes?.data ?? prodRes ?? [];

        let allProducts = fetchedProducts;
        if (!allProducts.length && Array.isArray(catData)) {
          const all = await Promise.all(
            catData.map((c) =>
              productsApi.getCategoryProducts(c.category_id || c.id)
            )
          );
          allProducts = all.map((r) => r?.data ?? r ?? []).flat();
        }

        const mapped = allProducts.map((p) => {
          const categoryObj = catData.find(
            (c) => c.id === p.categoryId || c.category_id === p.categoryId
          );

          // Normalize name for lookup
          const normKey = normalize(p.name || "");
          // Get image OR fallback
          const imageUrl =
            productImages[normKey] ||
            'https://wallpapers.com/images/hd/blank-white-background-xbsfzsltjksfompa.jpg';

          return {
            id: p.id || p.product_id,
            name: p.name,
            category: categoryObj?.name || "",
            price: p.price ?? 0,
            originalPrice: p.originalPrice ?? p.price ?? 0,
            image: imageUrl,
            rating: 4.5,
            reviews: 25,
            discount: 0,
            organic: true,
            inStock:
              (p.status || "APPROVED") === "APPROVED" && (p.stock_count ?? 1) > 0,
          };
        });

        if (isMounted) {
          setCategories([{ id: "all", name: "All" }, ...catData]);
          // Store all products without filtering
          setProducts(mapped);
        }

      } catch (e) {
        console.error("Failed to load products or categories", e);
        if (isMounted) setError("Failed to load products");
      } finally {
        if (isMounted) setLoading(false);
      }
    })();
    return () => {
      isMounted = false;
    };
  }, []);

  // Listen for navigation events to detect when "Products" link is clicked
  useEffect(() => {
    const handleShowAllProducts = () => {
      setShowAllProducts(true);
    };

    const handleShowInStockOnly = () => {
      setShowAllProducts(false);
    };

    window.addEventListener("showAllProducts", handleShowAllProducts);
    window.addEventListener("showInStockOnly", handleShowInStockOnly);
    return () => {
      window.removeEventListener("showAllProducts", handleShowAllProducts);
      window.removeEventListener("showInStockOnly", handleShowInStockOnly);
    };
  }, []);

  useEffect(() => {
  const handleGlobalSearch = async (e) => {
    const query = e.detail?.toLowerCase() || "";
    console.log("Search received in ProductsPage:", query);

    if (!query.trim()) {
      setFilteredProducts(products);  // show ALL products
      return;
    }

    // Search ALL products (ignore inStock)
    const results = products.filter((p) =>
      p.name.toLowerCase().includes(query)
    );

    setFilteredProducts(results);
  };

  window.addEventListener("globalSearch", handleGlobalSearch);
  return () => window.removeEventListener("globalSearch", handleGlobalSearch);
}, [products]);


  useEffect(() => {

    const baseProducts = showAllProducts 
      ? products 
      : products.filter(p => p.inStock === true);

    let filtered = [...baseProducts];

    if (selectedCategory !== "All") {
      filtered = baseProducts.filter(
        (p) => p.category === selectedCategory
      );
    }

    filtered.sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.price - b.price;
        case "price-high":
          return b.price - a.price;
        case "rating":
          return b.rating - a.rating;
        default:
          return a.name.localeCompare(b.name);
      }
    });

     setFilteredProducts(filtered);
  }, [selectedCategory, sortBy, products, showAllProducts]);

  async function handleAddToCart(product) {
    try {
      let cart = await cartApi.getMyCart();
      if (!cart) {
        cart = await cartApi.createCart("me");
      }
      await cartApi.addItem(cart.id, product.id, 1);
      window.dispatchEvent(new CustomEvent("cartUpdated"));
      alert(`${product.name} added to cart!`);
    } catch (err) {
      console.error("Failed to add item:", err);
      alert("Could not add item to cart.");
    }
  }

  const handleProductClick = (product) => {
    window.history.pushState({}, "", `/product/${product.id}`);
    window.dispatchEvent(new PopStateEvent("popstate"));
  };

  return (
    <div className="products-container">
      <Hero />
      <Controls
        categories={categories.map((c) => c.name)}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        sortBy={sortBy}
        onChangeSort={setSortBy}
        viewMode={viewMode}
        onChangeView={setViewMode}
      />

      <section className="products-section">
        <div className={`products-grid ${viewMode}`}>
          {loading && <div style={{ padding: 16 }}>Loading products...</div>}
          {error && (
            <div style={{ padding: 16, color: "red" }}>{error}</div>
          )}
          {!loading &&
            filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                viewMode={viewMode}
                onAddToCart={handleAddToCart}
                onOpen={handleProductClick}
              />
            ))}
        </div>
      </section>
    </div>
  );
}
