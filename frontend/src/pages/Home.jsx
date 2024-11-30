import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Home() {
  const [products, setProducts] = useState([]);
  const apiHost = import.meta.env.VITE_API_HOST;
  console.log("API Host:", apiHost);
  const apiUrl = apiHost + "/Home";
  console.log("All Cards:", products);

  useEffect(() => {
    const fetchProducts = async () => {
      const apiUrl = import.meta.env.VITE_API_HOST + "/api/products";
      console.log("Fetching products from:", apiUrl);

      try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
          throw new Error("Error fetching products");
        }
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    console.log("Products state:", products);
  }, [products]);

  return (
    <div>
      <h1>Welcome to the Yu-Gi-Oh! Shop</h1>
      <div className="product-list">
        {products.length === 0 ? (
          <p>No products found.</p>
        ) : (
          products.map((product) => (
            <div key={product.product_id} className="product-card">
              <Link
                to={`/details/${product.product_id}`}
                className="product-link"
              >
                <div className="product-box">
                  <img
                    src={`${apiHost}/public/images/${product.image_filename}`}
                    alt={product.name}
                    className="product-image"
                  />
                  <div className="card-info">
                    <div className="card-name">{product.name}</div>
                    <div className="card-details">
                      <span className="card-rarity">{product.rarity}</span>
                      <span className="card-stock">
                        {product.stockQuantity} listings from
                      </span>
                      <span className="card-price">${product.cost}</span>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Home;
