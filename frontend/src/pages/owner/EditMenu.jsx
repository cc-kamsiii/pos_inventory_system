import { Trash2 } from "lucide-react";
import axios from "axios";
import { useEffect, useState } from "react";
import "../../Style/EditMenu.css";

function EditMenu() {
  const [menuItems, setMenuItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [isNewCategory, setIsNewCategory] = useState(false);
  const [formData, setFormData] = useState({
    item_name: "",
    price: "",
    category: "",
    size: "",
  });

  const fetchData = async () => {
    try {
      const [menuRes, catRes] = await Promise.all([
        axios.get("http://localhost:8081/menu"),
        axios.get("http://localhost:8081/menu/categories"),
      ]);

      setMenuItems(menuRes.data);

      const categoryList = catRes.data.map((c) =>
        typeof c === "object" ? c.category : c
      );

      setCategories(categoryList);
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  };


  useEffect(() => {
    fetchData();
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      if (isNewCategory) {
        await axios.post("http://localhost:8081/menu/add-category", {
          category: formData.category,
        });
        alert("Category created successfully!");
      } else {
        await axios.post("http://localhost:8081/menu/add-item", formData);
        alert("Item added successfully!");
      }

      setShowAddModal(false);
      setFormData({ item_name: "", price: "", category: "", size: "" });
      fetchData();
    } catch (err) {
      console.error("Error adding:", err);
      alert("Failed to add item or category.");
    }
  };

  return (
    <div className="editmenu-container">
      <div className="editmenu-header">
        <h2>🍴 Edit Menu</h2>
        <button className="btn-add" onClick={() => setShowAddModal(true)}>
          + Add Item / Category
        </button>
      </div>

      <div className="menu-list">
        {categories.map((cat) => (
          <div key={cat} className="menu-category">
            <h3>{cat}</h3>
            <ul>
              {menuItems
                .filter((item) => item.category === cat && item.item_name !== "")
                .map((item) => (
                  <li key={item.id}>
                    {item.item_name} — ₱{item.price} ({item.size})
                  </li>
                ))}
            </ul>
          </div>
        ))}
      </div>

      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>{isNewCategory ? "Create New Category" : "Add New Menu Item"}</h3>
            <form onSubmit={handleAdd}>
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={isNewCategory}
                  onChange={(e) => setIsNewCategory(e.target.checked)}
                />
                Create new category
              </label>


              {!isNewCategory ? (
                <>
                  <label>Item Name:</label>
                  <input
                    type="text"
                    value={formData.item_name}
                    onChange={(e) =>
                      setFormData({ ...formData, item_name: e.target.value })
                    }
                    required
                  />

                  <label>Price:</label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({ ...formData, price: e.target.value })
                    }
                    required
                  />

                  <label>Category:</label>
                  <select
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                    required
                  >
                    <option value="">Select Category</option>
                    {categories.map((cat, i) => (
                      <option key={i} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>

                  <label>Size:</label>
                  <input
                    type="text"
                    value={formData.size}
                    onChange={(e) =>
                      setFormData({ ...formData, size: e.target.value })
                    }
                  />
                </>
              ) : (
                <>
                  <label>Category Name:</label>
                  <input
                    type="text"
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                    required
                  />
                </>
              )}

              <div className="modal-actions">
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={() => setShowAddModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-submit">
                  {isNewCategory ? "Create Category" : "Add Item"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default EditMenu;
