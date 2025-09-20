import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Menu from '../../components/Sidebar/Staff/Menu';
import Categories from '../../components/Sidebar/Staff/Categories';
import OrderSummary from '../../components/Sidebar/Staff/OrderSummary';
import Modal from '../../components/Sidebar/Staff/Modal';
import "../../Style/POS.css";

function POS() {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showModal, setShowModal] = useState(false);
  const [lastTransaction, setLastTransaction] = useState({});

  // Fetch from backend
  useEffect(() => {
    axios.get("http://localhost:8081/menu")        
      .then(res => setProducts(res.data))
      .catch(err => console.error(err));

    axios.get("http://localhost:8081/menu/categories") 
      .then(res => {
        const allCount = res.data.reduce((sum, c) => sum + c.count, 0);
        setCategories([
          { name: "All", count: allCount },
          ...res.data.map(c => ({ name: c.category, count: c.count }))
        ]);
      })
      .catch(err => console.error(err));
  }, []);

  const addToCart = (product) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id);
      if (existingItem) {
        return prevCart.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
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
    setCart(prevCart =>
      prevCart.map(item =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const removeFromCart = (id) => {
    setCart(prevCart => prevCart.filter(item => item.id !== id));
  };

  const clearCart = () => {
    setCart([]);
  };

  const checkout = (total) => {
    setLastTransaction({ total, paymentMethod: 'cash' });
    setShowModal(true);
    setCart([]);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <div className="pos-system">
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

        <div className="pos-right">
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