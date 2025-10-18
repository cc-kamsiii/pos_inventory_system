import { useState } from "react";
import { Trash2 } from "lucide-react";
import "../../Style/EditMenu.css";

function EditMenu() {
  const [menuItems, setMenuItems] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [formData, setFormData] = useState({ name: "", price: "" });

  const handleAddItem = (e) => {
    e.preventDefault();
    if (formData.name && formData.price) {
      const newItem = {
        id: Date.now(),
        name: formData.name,
        price: parseFloat(formData.price).toFixed(2),
        createdAt: new Date().toLocaleDateString(),
      };
      setMenuItems([...menuItems, newItem]);
      setFormData({ name: "", price: "" });
      setShowAddModal(false);
    }
  };

  const handleDeleteClick = (item) => {
    setItemToDelete(item);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    setMenuItems(menuItems.filter((m) => m.id !== itemToDelete.id));
    setItemToDelete(null);
    setShowDeleteModal(false);
  };

  return (
    <div className="editmenu-container">
      <div className="editmenu-header">
        <h2>Edit Menu</h2>
        <p className="editmenu-subtitle">Add or remove items from your menu</p>
      </div>

      <div className="editmenu-option">
        <button className="btn-add" onClick={() => setShowAddModal(true)}>
          Add Menu Item
        </button>
      </div>

      {/* Menu List */}
      <div className="menu-list">
        <h3>Current Menu Items ({menuItems.length})</h3>
        {menuItems.length === 0 ? (
          <p className="no-items">No menu items added yet</p>
        ) : (
          <div className="menu-cards">
            {menuItems.map((item) => (
              <div key={item.id} className="menu-card">
                <div className="menu-info">
                  <strong>{item.name}</strong>
                  <small>₱{item.price}</small>
                  <small>Added: {item.createdAt}</small>
                </div>
                <Trash2
                  className="trash-icon"
                  size={20}
                  onClick={() => handleDeleteClick(item)}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Item Modal */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>Add Menu Item</h3>
            <form onSubmit={handleAddItem}>
              <div className="form-group">
                <label>Item Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="Enter item name"
                  required
                />
              </div>
              <div className="form-group">
                <label>Price (₱)</label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({ ...formData, price: e.target.value })
                  }
                  placeholder="Enter price"
                  step="0.01"
                  required
                />
              </div>
              <div className="modal-actions">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="btn-cancel"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-submit">
                  Add
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="modal-overlay" onClick={() => setShowDeleteModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>Confirm Delete</h3>
            <p>
              Are you sure you want to delete{" "}
              <strong>{itemToDelete?.name}</strong>?
            </p>
            <div className="warning-text">⚠️ This action cannot be undone.</div>
            <div className="modal-actions">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="btn-cancel"
              >
                Cancel
              </button>
              <button onClick={confirmDelete} className="btn-delete-confirm">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default EditMenu;