import React, { useState, useEffect } from "react";
import axios from "axios";
import { ShoppingCart } from "lucide-react";
import Menu from "../../components/Sidebar/Staff/Menu";
import Categories from "../../components/Sidebar/Staff/Categories";
import OrderSummary from "../../components/Sidebar/Staff/OrderSummary";
import Modal from "../../components/Sidebar/Staff/Modal";
import "../../Style/POS.css";

function POS() {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [cart, setCart] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [showModal, setShowModal] = useState(false);
  const [lastTransaction, setLastTransaction] = useState({});
  const [showOrderSummary, setShowOrderSummary] = useState(false);

  const API_BASE = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    fetchCategories();
    fetchInventory();
  }, []);

  useEffect(() => {
    if (inventory.length > 0) {
      fetchProducts();
    }
  }, [inventory]);

  const fetchInventory = () => {
    axios
      .get(`${API_BASE}/inventory`)
      .then((res) => setInventory(res.data))
      .catch((err) => console.error(err));
  };

  const fetchProducts = async () => {
    try {
      const menuRes = await axios.get(`${API_BASE}/menu/`);
      const menus = menuRes.data;

      setProducts(menus); // stockStatus comes from backend
    } catch (err) {
      console.error(err);
    }
  };

  const calculateStockStatus = (item, inventory) => {
    // Helper function to normalize strings
    const normalize = (str) => str?.toLowerCase().trim() || "";

    if (!item.ingredients || item.ingredients.length === 0) {
      // Single-ingredient items - match by item_name
      const invItem = inventory.find(
        (inv) => normalize(inv.item) === normalize(item.item_name)
      );

      if (!invItem) return "no-stock";
      if (invItem.quantity < 1) return "no-stock";
      if (invItem.quantity < 2) return "low-stock";
      return "available";
    }

    // Multi-ingredient items
    let hasNoStock = false;
    let hasLowStock = false;

    for (const ing of item.ingredients) {
      const invItem = inventory.find(
        (inv) => normalize(inv.item) === normalize(ing.name)
      );

      if (!invItem) {
        hasNoStock = true;
        break;
      }

      const available = invItem.quantity;
      const required = ing.required_qty ?? 1;

      if (available < required) {
        hasNoStock = true;
        break;
      }

      if (available < required * 2) {
        hasLowStock = true;
      }
    }

    if (hasNoStock) return "no-stock";
    if (hasLowStock) return "low-stock";
    return "available";
  };

  const fetchCategories = () => {
    axios
      .get(`${API_BASE}/menu/categories`)
      .then((res) => {
        const allCount = res.data.reduce((sum, c) => sum + c.count, 0);
        setCategories([
          { name: "All", count: allCount },
          ...res.data.map((c) => ({ name: c.category, count: c.count })),
        ]);
      })
      .catch((err) => console.error(err));
  };

  const addToCart = (product) => {
    if (product.stockStatus === "no-stock") {
      alert("This item is out of stock!");
      return;
    }

    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id);
      if (existingItem) {
        return prevCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: existingItem.quantity + 1 }
            : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
  };

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(id);
      return;
    }
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const removeFromCart = (id) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id));
  };

  const clearCart = () => setCart([]);

  const validateCartStock = () => {
    return axios
      .get(`${API_BASE}/inventory`)
      .then((res) => {
        const currentInventory = res.data;
        const outOfStockItems = [];

        cart.forEach((cartItem) => {
          if (cartItem.stockStatus === "no-stock") {
            outOfStockItems.push(cartItem.item_name);
          }
        });

        if (outOfStockItems.length > 0) {
          alert(
            `The following items are out of stock:\n${outOfStockItems.join(
              ", "
            )}`
          );
          return false;
        }
        return true;
      })
      .catch((err) => {
        console.error("Error validating stock:", err);
        alert("Error checking stock availability.");
        return false;
      });
  };

  const checkout = async (total, payment, change, orderType, paymentMethod) => {
    const cashierName = localStorage.getItem("name");
    const userId = localStorage.getItem("user_id");

    if (!cart.length) return alert("Cart is empty!");
    if (!cashierName || !userId) return alert("User not logged in!");

    const stockValid = await validateCartStock();
    if (!stockValid) {
      fetchProducts();
      return;
    }

    const transactionData = {
      cart,
      payment_method: paymentMethod,
      total_payment: total,
      cashier_name: cashierName,
      order_type: orderType,
      user_id: userId,
    };

    axios
      .post(`${API_BASE}/staffTransactions`, transactionData)
      .then(() => {
        setLastTransaction({
          total_payment: total,
          payment_method: paymentMethod,
          cashier_name: cashierName,
          order_type: orderType,
          user_id: userId,
        });
        setShowModal(true);
        setCart([]);
        setShowOrderSummary(false);
        fetchProducts();
      })
      .catch((err) => {
        console.error("Transaction error:", err);
        if (err.response?.status === 400) {
          alert("Transaction failed: Insufficient stock for some items.");
          fetchProducts();
        } else {
          alert("Transaction failed. Please try again.");
        }
      });
  };

  const closeModal = () => setShowModal(false);

  return (
    <div className="pos-system">
      <button
        className="order-summary-toggle"
        onClick={() => setShowOrderSummary(!showOrderSummary)}
      >
        <ShoppingCart size={20} />
        <span>Order</span>
        {cart.length > 0 && <span className="cart-badge">{cart.length}</span>}
      </button>

      <div className="pos-main">
        <div className="pos-left">
          <Categories
            categories={categories}
            selectedCategory={selectedCategory}
            onCategorySelect={setSelectedCategory}
          />
          <Menu
            products={products}
            onAddToCart={addToCart}
            selectedCategory={selectedCategory}
          />
        </div>

        <div className={`pos-right ${showOrderSummary ? "show" : ""}`}>
          <OrderSummary
            cart={cart}
            onUpdateQuantity={updateQuantity}
            onRemoveItem={removeFromCart}
            onCheckout={checkout}
            onClear={clearCart}
          />
        </div>
      </div>

      <Modal
        isVisible={showModal}
        onClose={closeModal}
        lastTransaction={lastTransaction}
      />
    </div>
  );
}

export default POS;
