import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Eye,
  Pencil,
  Trash,
  AlertTriangle,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Filter,
  ArchiveIcon,
} from "lucide-react";
import axios from "axios";
import "../../Style/Inventory.css";

function Inventory() {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });
  const [selectedCategory, setSelectedCategory] = useState("all");

  const API_BASE = import.meta.env.VITE_API_BASE_URL;

  const categories = [
    { value: "all", label: "All Categories" },
    { value: "meat", label: "Meat & Poultry" },
    { value: "seafood", label: "Seafood" },
    { value: "vegetables", label: "Vegetables & Produce" },
    { value: "condiments", label: "Condiments & Sauces" },
    { value: "beverages", label: "Drinks" },
    { value: "rice", label: "Rice & Grains" },
    { value: "noodles", label: "Noodles" },
    { value: "processed", label: "Processed & Canned Goods" },
  ];

  useEffect(() => {
    axios
      .get(`${API_BASE}/inventory`)
      .then((res) => {
        setData(res.data);
        setFilteredData(res.data);
      })
      .catch((err) => console.log(err));
  }, []);

  function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US");
  }

  const handleDelete = (id) => {
    axios
      .delete(`${API_BASE}/inventory/${id}`)
      .then(() => {
        const updatedData = data.filter((item) => item.id !== id);
        setData(updatedData);
        applyFilters(updatedData, search, selectedCategory);
      })
      .catch((err) => console.log(err));
  };

  function isLowStock(item, quantity, unit) {
    const lower = item.toLowerCase();

    if (
      lower.includes("rice") ||
      lower.includes("tapa") ||
      lower.includes("bangus") ||
      lower.includes("chicken") ||
      lower.includes("lechon") ||
      lower.includes("pulpo") ||
      lower.includes("beef") ||
      lower.includes("pork") ||
      lower.includes("broccoli") ||
      lower.includes("vegetable") ||
      lower.includes("garlic") ||
      lower.includes("onion")
    ) {
      return quantity < 10;
    } else if (
      lower.includes("syrup") ||
      lower.includes("mix") ||
      lower.includes("sauce") ||
      lower.includes("mayonnaise") ||
      lower.includes("ketchup") ||
      lower.includes("gravy") ||
      lower.includes("juice") ||
      lower.includes("lemonade")
    ) {
      return quantity < 5;
    } else if (unit === "pcs" && quantity < 20) {
      return true;
    } else if (unit === "cans" && quantity < 20) {
      return true;
    } else if (unit === "bottles" && quantity < 20) {
      return true;
    }
    return false;
  }

  // Auto-categorize items based on keywords
  const getCategoryFromItem = (itemName) => {
    const lower = itemName.toLowerCase();

    // Meat & Poultry
    if (
      lower.includes("chicken") ||
      lower.includes("tapa") ||
      lower.includes("lechon") ||
      lower.includes("beef") ||
      lower.includes("pork") ||
      lower.includes("meat") ||
      lower.includes("liempo") ||
      lower.includes("egg")
    ) {
      return "meat";
    }

    // Seafood
    if (
      lower.includes("bangus") ||
      lower.includes("pulpo") ||
      lower.includes("fish") ||
      lower.includes("shrimp") ||
      lower.includes("seafood")
    ) {
      return "seafood";
    }

    // Vegetables & Produce
    if (
      lower.includes("broccoli") ||
      lower.includes("vegetable") ||
      lower.includes("garlic") ||
      lower.includes("onion") ||
      lower.includes("tomato") ||
      lower.includes("lettuce") ||
      lower.includes("eggplant") ||
      lower.includes("tokwa") ||
      lower.includes("tofu") ||
      lower.includes("calamansi")
    ) {
      return "vegetables";
    }

    // Condiments & Sauces
    if (
      lower.includes("sauce") ||
      lower.includes("mayonnaise") ||
      lower.includes("ketchup") ||
      lower.includes("gravy") ||
      lower.includes("condiment") ||
      lower.includes("vinegar") ||
      lower.includes("fish sauce") ||
      lower.includes("sinigang") ||
      lower.includes("cooking oil") ||
      lower.includes("oil") ||
      lower.includes("black pepper") ||
      lower.includes("pepper") ||
      lower.includes("salt")
    ) {
      return "condiments";
    }

    // Beverages
    if (
      lower.includes("juice") ||
      lower.includes("lemonade") ||
      lower.includes("syrup") ||
      lower.includes("mix") ||
      lower.includes("drink") ||
      lower.includes("beverage") ||
      lower.includes("soda") ||
      lower.includes("water") ||
      lower.includes("coffee") ||
      lower.includes("yakult") ||
      lower.includes("coke") ||
      lower.includes("sprite") ||
      lower.includes("royal") ||
      lower.includes("mountain dew") ||
      lower.includes("pepsi") ||
      lower.includes("mug") ||
      lower.includes("rootbeer")
    ) {
      return "beverages";
    }

    // Rice & Grains
    if (
      lower.includes("rice") ||
      lower.includes("grain") ||
      lower.includes("flour")
    ) {
      return "rice";
    }

    // Noodles
    if (
      lower.includes("noodle") ||
      lower.includes("bihon") ||
      lower.includes("canton") ||
      lower.includes("pasta") ||
      lower.includes("spaghetti")
    ) {
      return "noodles";
    }

    // Processed & Canned Goods
    if (
      lower.includes("corned beef") ||
      lower.includes("luncheon") ||
      lower.includes("longganisa") ||
      lower.includes("hotdog") ||
      lower.includes("hot dog") ||
      lower.includes("tocino") ||
      lower.includes("ham") ||
      lower.includes("hungarian") ||
      lower.includes("sausage") ||
      lower.includes("sardines") ||
      lower.includes("canned") ||
      lower.includes("processed")
    ) {
      return "processed";
    }

    return "other";
  };

  // Combined filter function for search and category
  const applyFilters = (dataToFilter, searchTerm, category) => {
    let filtered = dataToFilter;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter((item) =>
        item.item.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply category filter
    if (category !== "all") {
      filtered = filtered.filter((item) => {
        const itemCategory = item.category || getCategoryFromItem(item.item);
        return itemCategory === category;
      });
    }

    setFilteredData(filtered);
    setSortConfig({ key: null, direction: null }); // Reset sorting when filters change
  };

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearch(value);
    applyFilters(data, value, selectedCategory);
  };

  const handleCategoryChange = (e) => {
    const category = e.target.value;
    setSelectedCategory(category);
    applyFilters(data, search, category);
  };

  // Sorting function
  const handleSort = (key) => {
    let direction = "asc";

    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    } else if (sortConfig.key === key && sortConfig.direction === "desc") {
      setSortConfig({ key: null, direction: null });
      applyFilters(data, search, selectedCategory);
      return;
    }

    setSortConfig({ key, direction });

    const sorted = [...filteredData].sort((a, b) => {
      let aValue, bValue;

      switch (key) {
        case "item":
          aValue = a.item.toLowerCase();
          bValue = b.item.toLowerCase();
          break;
        case "price":
          aValue = parseFloat(a.price);
          bValue = parseFloat(b.price);
          break;
        case "quantity":
          aValue = parseFloat(a.quantity);
          bValue = parseFloat(b.quantity);
          break;
        case "unit":
          aValue = a.unit.toLowerCase();
          bValue = b.unit.toLowerCase();
          break;
        case "last_update":
          aValue = new Date(a.last_update);
          bValue = new Date(b.last_update);
          break;
        default:
          return 0;
      }

      if (aValue < bValue) {
        return direction === "asc" ? -1 : 1;
      }
      if (aValue > bValue) {
        return direction === "asc" ? 1 : -1;
      }
      return 0;
    });

    setFilteredData(sorted);
  };

  const getSortIcon = (columnKey) => {
    if (sortConfig.key !== columnKey) {
      return <ArrowUpDown size={16} className="sort-icon-neutral" />;
    }
    return sortConfig.direction === "asc" ? (
      <ArrowUp size={16} className="sort-icon-active" />
    ) : (
      <ArrowDown size={16} className="sort-icon-active" />
    );
  };

  const getCategoryCount = () => {
    if (selectedCategory === "all") {
      return data.length;
    }
    return data.filter((item) => {
      const itemCategory = item.category || getCategoryFromItem(item.item);
      return itemCategory === selectedCategory;
    }).length;
  };

  const archiveItem = (id) => {
    axios
      .post(`${API_BASE}/inventory/archive/${id}`)
      .then(() => {
        const updated = data.filter((item) => item.id !== id);
        setData(updated);
        applyFilters(updated, search, selectedCategory);
        alert("Item archived successfully");
      })
      .catch((err) => {
        const message = err.response?.data?.message || "Error archiving item";
        alert(message); // This should show: 'Cannot archive "testing". It is used in 2 recipe(s)...'
        console.error("Archive error:", err.response?.data);
      });
  };

  return (
    <div className="inventory">
      <div className="inventory-container">
        <div className="title-search-create">
          <h2>Inventory Management</h2>

          <div className="title-row">
            <Link to="/add">
              <button className="add-btn">Add Inventory</button>
            </Link>
            <div className="filter-search-group">
              <div className="category-filter">
                <Filter size={18} />
                <select
                  value={selectedCategory}
                  onChange={handleCategoryChange}
                  className="category-select"
                >
                  {categories.map((cat) => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>
              <form onSubmit={(e) => e.preventDefault()}>
                <input
                  type="text"
                  placeholder="Search inventory"
                  value={search}
                  onChange={handleSearch}
                />
              </form>
            </div>
          </div>
        </div>

        <div className="filter-info">
          <span className="result-count">
            Showing {filteredData.length} of {getCategoryCount()} items
            {selectedCategory !== "all" && (
              <span className="active-filter">
                {" "}
                in {categories.find((c) => c.value === selectedCategory)?.label}
              </span>
            )}
          </span>
          {(search || selectedCategory !== "all") && (
            <button
              className="clear-filters-btn"
              onClick={() => {
                setSearch("");
                setSelectedCategory("all");
                setFilteredData(data);
                setSortConfig({ key: null, direction: null });
              }}
            >
              Clear Filters
            </button>
          )}
        </div>

        <div className="table">
          <table>
            <thead>
              <tr>
                <th
                  onClick={() => handleSort("item")}
                  className="sortable-header"
                >
                  <div className="header-content-inventory">
                    <span>Item Name</span>
                    {getSortIcon("item")}
                  </div>
                </th>
                <th
                  onClick={() => handleSort("price")}
                  className="sortable-header"
                >
                  <div className="header-content">
                    <span>Price</span>
                    {getSortIcon("price")}
                  </div>
                </th>
                <th
                  onClick={() => handleSort("quantity")}
                  className="sortable-header"
                >
                  <div className="header-content">
                    <span>Quantity</span>
                    {getSortIcon("quantity")}
                  </div>
                </th>
                <th
                  onClick={() => handleSort("unit")}
                  className="sortable-header"
                >
                  <div className="header-content">
                    <span>Unit</span>
                    {getSortIcon("unit")}
                  </div>
                </th>
                <th
                  onClick={() => handleSort("last_update")}
                  className="sortable-header"
                >
                  <div className="header-content">
                    <span>Last Update</span>
                    {getSortIcon("last_update")}
                  </div>
                </th>
                <th>Alert</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.length > 0 ? (
                filteredData.map((inventory, index) => {
                  const low = isLowStock(
                    inventory.item,
                    inventory.quantity,
                    inventory.unit
                  );
                  const noStock = inventory.quantity <= 0;

                  return (
                    <tr
                      key={index}
                      className={noStock ? "no-stock" : low ? "low-stock" : ""}
                      title={
                        noStock ? "No stock!" : low ? "Low stock alert!" : ""
                      }
                    >
                      <td>{inventory.item}</td>
                      <td>₱{inventory.price}</td>
                      <td>{inventory.quantity}</td>
                      <td>{inventory.unit}</td>
                      <td>{formatDate(inventory.last_update)}</td>
                      <td>
                        {noStock ? (
                          <div className="no-alert">
                            <AlertTriangle size={20} />
                            <span>No Stock!</span>
                          </div>
                        ) : low ? (
                          <div className="low-alert">
                            <AlertTriangle size={20} />
                            <span>Low Stock!</span>
                          </div>
                        ) : (
                          "—"
                        )}
                      </td>
                      <td>
                        <div className="action-button">
                          <Link to={`/read/${inventory.id}`}>
                            <button className="eye-button">
                              <Eye />
                            </button>
                          </Link>
                          <Link to={`/edit/${inventory.id}`}>
                            <button className="edit-button">
                              <Pencil />
                            </button>
                          </Link>
                          <button
                            className="archive-button"
                            onClick={() => {
                              if (window.confirm("Archive this item?")) {
                                archiveItem(inventory.id);
                              }
                            }}
                          >
                            <ArchiveIcon />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="7" style={{ textAlign: "center" }}>
                    No items found
                    {(search || selectedCategory !== "all") && "."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Inventory;
