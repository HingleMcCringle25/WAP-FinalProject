import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

function Details() {
  const { id } = useParams(); // Get product ID from the URL params
  const [product, setProduct] = useState(null);
  const navigate = useNavigate(); // Initialize navigate for "Go back" functionality

  useEffect(() => {
    // Fetch product details based on the ID from the URL
    const fetchProduct = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_HOST}/api/products/${id}`
        );
        if (response.ok) {
          const data = await response.json();
          setProduct(data); // Update state with the fetched product details
        } else {
          console.error("Failed to fetch product:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching product details:", error);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    const existingCart = Cookies.get("cart");
    const newCart = existingCart ? `${existingCart},${id}` : id;
    Cookies.set("cart", newCart, { expires: 7 });
    console.log(`Added ${product.name} to the cart.`);
  };

  const handleGoBack = () => {
    navigate("/"); 
  };

  if (!product) {
    return <p>Loading product details...</p>;
  }

  return (
    <div className="product-detail-container">
      <div className="product-detail-box">
        {/* Image Box (on left) */}
        <div className="product-image-container">
          <img
            src={`${import.meta.env.VITE_API_HOST}/public/images/${
              product.image_filename
            }`}
            alt={product.name}
            className="product-detail-img"
          />
        </div>

        {/* Product Info Box (on right) */}
        <div className="product-detail-info">
          <h2>{product.name}</h2>
          <p>
            <strong>Description:</strong> {product.description}
          </p>
          <p>
            <strong>Price:</strong> ${product.cost}
          </p>
          <p>
            <strong>Stock:</strong> {product.stockQuantity}
          </p>
          <p>
            <strong>Rarity:</strong> {product.rarity}
          </p>
          <p>
            <strong>Condition:</strong> {product.condition}
          </p>
          <p>
            <strong>Edition:</strong> {product.edition}
          </p>
          <div className="product-actions">
            <button onClick={handleAddToCart}>Add to Cart</button>
            <button onClick={handleGoBack}>Go Back</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Details;
