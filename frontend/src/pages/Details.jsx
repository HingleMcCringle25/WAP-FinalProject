import Cookies from "js-cookie";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const Details = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const navigate = useNavigate();

  const fetchProduct = async () => {
    try {
      const response = await fetch(`http://localhost:3200/api/products/${id}`, {
        credentials: "include",
      });
      const data = await response.json();
      setProduct(data);
    } catch (error) {
      console.error("Error fetching product details:", error);
    }
  };

  const checkSession = async () => {
    try {
      const response = await fetch("http://localhost:3200/api/users/getSession", {
        credentials: "include",
      });

      if (!response.ok) {
        alert("You need to be logged in to add items to the cart.");
        navigate("/login");
        return false;
      }

      return true;
    } catch (error) {
      console.error("Error checking session:", error);
      return false;
    }
  };

  const handleAddToCart = async () => {
    const isLoggedIn = await checkSession();
    if (!isLoggedIn) return;

    
    const existingCart = Cookies.get("cart");
    const cart = existingCart ? existingCart.split(",") : [];
    cart.push(id);
    Cookies.set("cart", cart.join(","), { expires: 7 });

    alert("Product added to cart!");
  };

  useEffect(() => {
    fetchProduct();
  }, [id]);

  if (!product) {
    return <p>Loading product details...</p>;
  }

  return (
    <div className="detailPage-products">
      <div className="detailsProduct-box">
        
        <img
          src={`http://localhost:3200/public/images/${product.image_filename}`}
          alt={product.name}
          style={{ maxWidth: "400px", maxHeight: "400px" }}
        />
        <div className="details-product-info">
          <h1>{product.name}</h1>
          <p><strong>Price:</strong> ${product.cost.toFixed(2)}</p>
          <p><strong>Description:</strong> {product.description}</p>
          <p><strong>Rarity:</strong> {product.rarity}</p>
          <p><strong>Condition:</strong> {product.condition}</p>
          <p><strong>Edition:</strong> {product.edition}</p>
          <p><strong>Stock Quantity:</strong> {product.stockQuantity}</p>

          <button onClick={handleAddToCart}>Add to Cart</button>
        </div>
      </div>
      <div className="go-back-button">
        <button onClick={() => navigate("/")}>Go Back</button>
      </div>
    </div>
  );
};

export default Details;





