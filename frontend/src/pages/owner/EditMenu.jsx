import { Trash2, Pencil, ArchiveIcon } from "lucide-react";
import axios from "axios";
import { useEffect, useState } from "react";
import "../../Style/EditMenu.css";
import { useNavigate } from "react-router-dom";

function EditMenu() {
  const [menuItems, setMenuItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [isNewCategory, setIsNewCategory] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);

  const [ingredients, setIngredients] = useState([]);
  const [inventoryList, setInventoryList] = useState([]);
  const [newIngredient, setNewIngredient] = useState({
    ingredient_id: "",
    qty: "",
  });

  const [formData, setFormData] = useState({
    item_name: "",
    price: "",
    category: "",
    size: "",
  });

  const API_BASE = import.meta.env.VITE_API_BASE_URL;
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      const [menuRes, catRes] = await Promise.all([
        axios.get(`${API_BASE}/menu`),
        axios.get(`${API_BASE}/menu/categories`),
      ]);

      setMenuItems(menuRes.data);
      const categoryList = catRes.data.map((c) =>
        typeof c === "object" ? c.category : c
      );
      const filtered = categoryList.filter((c) => c && c.trim() !== "");
      setCategories(filtered);
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleEdit = async (item) => {
    setIsEditing(true);
    setEditId(item.id);
    setShowAddModal(true);

    setFormData({
      item_name: item.item_name,
      price: item.price,
      category: item.category,
      size: item.size || "",
    });

    const inv = await axios.get(`${API_BASE}/inventory`);
    setInventoryList(inv.data);

    const ing = await axios.get(`${API_BASE}/menu/${item.id}/ingredients`);
    setIngredients(ing.data);
  };

  const handleAdd = async (e) => {
    e.preventDefault();

    try {
      if (isNewCategory) {
        await axios.post(`${API_BASE}/menu/add-category`, {
          category: formData.category,
        });
        alert("Category created successfully!");
      } else if (isEditing && editId) {
        await axios.put(`${API_BASE}/menu/update/${editId}`, formData);
        await axios.post(`${API_BASE}/menu/${editId}/ingredients/save`, {
          id: editId,
          ingredients: ingredients,
        });
        alert("Menu item updated successfully!");
      } else {
        const res = await axios.post(`${API_BASE}/menu/add-item`, formData);
        const newId = res.data.menu_id;
        if (ingredients.length > 0) {
          await axios.post(`${API_BASE}/menu/${newId}/ingredients/save`, {
            id: newId,
            ingredients: ingredients,
          });
        }
        alert("Menu item added successfully!");
      }

      setShowAddModal(false);
      setFormData({ item_name: "", price: "", category: "", size: "" });
      setIngredients([]);
      setIsEditing(false);
      setIsNewCategory(false);
      fetchData();
    } catch (err) {
      console.error("Error saving:", err);
      alert("Failed to save. Check console for details.");
    }
  };

  const handleArchive = async (id) => {
    if (!window.confirm("Archive this item?")) return;

    try {
      await axios.post(`${API_BASE}/menu/archive/${id}`);
      alert("Menu item archived successfully!");
      fetchData();
    } catch (err) {
      console.error("Error archiving:", err);

      const errorData = err.response?.data;

      if (errorData?.usedInTransactions) {
        alert(errorData.message);
      } else {
        alert(
          errorData?.message ||
            "Failed to archive item. Check console for details."
        );
      }
    }
  };

  const addIngredient = () => {
    if (!newIngredient.ingredient_id || !newIngredient.qty) return;

    const selected = inventoryList.find(
      (inv) => inv.id == newIngredient.ingredient_id
    );

    setIngredients([
      ...ingredients,
      {
        ingredient_id: selected.id,
        ingredient_name: selected.item,
        amount_per_serving: parseFloat(newIngredient.qty),
      },
    ]);

    setNewIngredient({ ingredient_id: "", qty: "" });
  };

  const removeIngredient = (i) => {
    setIngredients(ingredients.filter((_, index) => index !== i));
  };

  const resetForm = () => {
    setFormData({ item_name: "", price: "", category: "", size: "" });
    setIngredients([]);
    setIsEditing(false);
    setIsNewCategory(false);
    setEditId(null);
    setNewIngredient({ ingredient_id: "", qty: "" });
  };

  return (
    <div className="editmenu-container">
      <div className="editmenu-header">
        <h2>🍴 Edit Menu</h2>
        <div className="editAndAddButton">
          <button
            className="btn-add"
            onClick={async () => {
              setShowAddModal(true);
              setIsEditing(false);
              resetForm();

              const inv = await axios.get(`${API_BASE}/inventory`);
              setInventoryList(inv.data);
            }}
          >
            + Add Item / Category
          </button>
        </div>
      </div>

      <div className="menu-list">
        {categories.map((cat) => (
          <div key={cat} className="menu-category">
            <h3>{cat}</h3>
            <ul>
              {menuItems.filter((item) => item.category === cat).length > 0 ? (
                menuItems
                  .filter((item) => item.category === cat)
                  .map((item) => (
                    <li key={item.id} className="menu-item-row">
                      <span>
                        {item.item_name} — ₱{item.price} ({item.size})
                      </span>

                      <div className="action-grid">
                        <button
                          className="btn-edit"
                          onClick={() => handleEdit(item)}
                        >
                          <Pencil size={20} />
                        </button>

                        <button
                          className="btn-archive"
                          onClick={() => handleArchive(item.id)}
                        >
                          <ArchiveIcon size={20} />
                        </button>
                      </div>
                    </li>
                  ))
              ) : (
                <li className="no-items">No items available</li>
              )}
            </ul>
          </div>
        ))}
      </div>

      {/* MODAL */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div
            className="modal modal-landscape"
            onClick={(e) => e.stopPropagation()}
          >
            <h3>
              {isNewCategory
                ? "Create New Category"
                : isEditing
                ? "Edit Menu Item"
                : "Add New Menu Item"}
            </h3>

            <form id="menu-form" onSubmit={handleAdd} className="modal-grid">
              <div className="modal-left">
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
              </div>

              {/* RIGHT SIDE INGREDIENTS */}
              {!isNewCategory && (
                <div className="modal-right">
                  <h4>Ingredients</h4>

                  <div className="ingredient-table-wrapper">
                    <table className="ingredient-table">
                      <thead>
                        <tr>
                          <th>Ingredient</th>
                          <th>Serving</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {ingredients.length > 0 ? (
                          ingredients.map((ing, i) => (
                            <tr key={i}>
                              <td>{ing.ingredient_name}</td>
                              <td>{ing.amount_per_serving}</td>
                              <td>
                                <button
                                  type="button"
                                  className="delete-button-small"
                                  onClick={() => removeIngredient(i)}
                                >
                                  <Trash2 size={16} />
                                </button>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="3" style={{ textAlign: "center" }}>
                              No ingredients added
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>

                  <label>Select Ingredient (Inventory):</label>
                  <select
                    value={newIngredient.ingredient_id}
                    onChange={(e) =>
                      setNewIngredient({
                        ...newIngredient,
                        ingredient_id: e.target.value,
                      })
                    }
                  >
                    <option value="">Select</option>
                    {inventoryList.map((inv) => (
                      <option key={inv.id} value={inv.id}>
                        {inv.item}
                      </option>
                    ))}
                  </select>

                  <input
                    type="number"
                    placeholder="Qty per serving"
                    value={newIngredient.qty}
                    onChange={(e) =>
                      setNewIngredient({
                        ...newIngredient,
                        qty: e.target.value,
                      })
                    }
                  />

                  <button
                    type="button"
                    className="btn-add-ing"
                    onClick={addIngredient}
                  >
                    + Add Ingredient
                  </button>
                </div>
              )}
            </form>

            <div className="modal-actions">
              <button
                type="button"
                className="btn-cancel"
                onClick={() => {
                  resetForm();
                  setShowAddModal(false);
                }}
              >
                Cancel
              </button>
              <button type="submit" form="menu-form" className="btn-submit">
                {isNewCategory
                  ? "Create Category"
                  : isEditing
                  ? "Save Changes"
                  : "Add Item"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default EditMenu;
