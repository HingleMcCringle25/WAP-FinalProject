import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Home = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("http://localhost:3200/api/products", {
          credentials: "include",
        });
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="Home-Page">
      <h1>Our Products</h1>
      <div className="product-grid">
        {products.map((product) => (
          <div key={product.product_id} className="product-box">
            <img
              src={`http://localhost:3200/public/images/${product.image_filename}`}
              alt={product.name}
              className="product-image"
            />
            <div className="product-home-details">
              <h2>{product.name}</h2>
              <p>Rarity: {product.rarity}</p>
              <p>#{product.serialNumber}</p>
              <p>Amount in Stock: {product.stockQuantity}</p>
              <p>Price: ${product.cost.toFixed(2)}</p>
              <Link to={`/details/${product.product_id}`} className="details-link">
                View Details
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;

