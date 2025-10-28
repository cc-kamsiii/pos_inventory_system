import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Eye, Pencil, Trash, AlertTriangle } from "lucide-react";
import axios from "axios";
import "../../Style/Inventory.css";

function Inventory() {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState(""); 
  const [filteredData, setFilteredData] = useState([]); 

  const API_BASE = import.meta.env.VITE_API_BASE_URL;

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
        setFilteredData(updatedData);
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

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearch(value);
    const filtered = data.filter((item) =>
      item.item.toLowerCase().includes(value)
    );
    setFilteredData(filtered);
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

        <div className="table">
          <table>
            <thead>
              <tr>
                <th>Item Name</th>
                <th>Quantity</th>
                <th>Unit</th>
                <th>Last Update</th>
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
                  return (
                    <tr
                      key={index}
                      className={low ? "low-stock" : ""}
                      title={low ? "Low stock alert!" : ""}
                    >
                      <td>{inventory.item}</td>
                      <td>{inventory.quantity}</td>
                      <td>{inventory.unit}</td>
                      <td>{formatDate(inventory.last_update)}</td>
                      <td>
                        {low ? (
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
                            className="delete-button"
                            onClick={() => {
                              if (
                                window.confirm(
                                  "Are you sure you want to delete this item?"
                                )
                              ) {
                                handleDelete(inventory.id);
                              }
                            }}
                          >
                            <Trash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="6" style={{ textAlign: "center" }}>
                    No items found
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
