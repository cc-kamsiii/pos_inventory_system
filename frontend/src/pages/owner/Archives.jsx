import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { RotateCcw, Trash2 } from "lucide-react";
import axios from "axios";
import "../../Style/Archives.css";

function Archives() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("accounts");

  const API_BASE = import.meta.env.VITE_API_BASE_URL;

  const [archivedAccounts, setArchivedAccounts] = useState([]);
  const [archivedMenus, setArchivedMenus] = useState([]);
  const [archivedInventories, setArchivedInventories] = useState([]);

  const fetchArchivedAccounts = async () => {
    try {
      const res = await axios.get(`${API_BASE}/auth/archived`);
      const formattedData = res.data.map(user => ({
        ...user,
        fullname: user.name
      }));
      setArchivedAccounts(formattedData);
    } catch (err) {
      console.log("Error fetching archived accounts:", err);
    }
  };

  const fetchArchivedMenus = async () => {
    try {
      const res = await axios.get(`${API_BASE}/menu/archived`);
      setArchivedMenus(res.data);
    } catch (err) {
      console.log("Error fetching archived menus:", err);
    }
  };

  const fetchArchivedInventory = async () => {
    try {
      const res = await axios.get(`${API_BASE}/inventory/archived`);
      setArchivedInventories(res.data);
    } catch (err) {
      console.log("Error fetching archived inventory:", err);
    }
  };

  useEffect(() => {
    if (activeTab === "accounts") fetchArchivedAccounts();
    if (activeTab === "menus") fetchArchivedMenus();
    if (activeTab === "inventories") fetchArchivedInventory();
  }, [activeTab]);

  const getArchivedData = () => {
    switch (activeTab) {
      case "accounts":
        return archivedAccounts;
      case "menus":
        return archivedMenus;
      case "inventories":
        return archivedInventories;
      default:
        return [];
    }
  };

  const getTableHeaders = () => {
    switch (activeTab) {
      case "accounts":
        return ["Name", "Username", "Role", "Archived Date", "Actions"];
      case "menus":
        return ["Item Name", "Category", "Price", "Archived Date", "Actions"];
      case "inventories":
        return [
          "Item Name",
          "Category",
          "Quantity",
          "Archived Date",
          "Actions",
        ];
      default:
        return [];
    }
  };

  const handleRestore = async (id, type) => {
    if (!window.confirm(`Restore this ${type}?`)) return;

    try {
      const endpoint = type === "account" ? "auth" : type;
      await axios.post(`${API_BASE}/${endpoint}/restore/${id}`);

      if (type === "account") {
        setArchivedAccounts(archivedAccounts.filter((acc) => acc.id !== id));
      }

      if (type === "menu") {
        setArchivedMenus(archivedMenus.filter((menu) => menu.id !== id));
      }

      if (type === "inventory") {
        setArchivedInventories(
          archivedInventories.filter((inv) => inv.id !== id)
        );
      }

      alert("Item restored successfully!");
    } catch (err) {
      console.log(err);
      const message = err.response?.data?.message || "Error restoring item.";
      alert(message);
    }
  };

  const handleDelete = async (id, type) => {
    if (
      !window.confirm(
        `Are you sure you want to permanently delete this ${type}? This action cannot be undone!`
      )
    )
      return;

    try {
      const endpoint = type === "account" ? "auth" : type;
      await axios.delete(`${API_BASE}/${endpoint}/permanent/${id}`);

      if (type === "account") {
        setArchivedAccounts(archivedAccounts.filter((acc) => acc.id !== id));
      }

      if (type === "menu") {
        setArchivedMenus(archivedMenus.filter((menu) => menu.id !== id));
      }

      if (type === "inventory") {
        setArchivedInventories(
          archivedInventories.filter((inv) => inv.id !== id)
        );
      }

      alert(`Archived ${type} deleted permanently.`);
    } catch (err) {
      console.log(err);
      alert("Error deleting item.");
    }
  };

  const renderTableRows = () => {
    const data = getArchivedData();

    const getTypeFromTab = (tab) => {
      switch (tab) {
        case "accounts":
          return "account";
        case "menus":
          return "menu";
        case "inventories":
          return "inventory";
        default:
          return tab.slice(0, -1);
      }
    };

    const type = getTypeFromTab(activeTab);

    return data.map((item) => (
      <tr key={item.id} className="archive-row">
        {activeTab === "accounts" && (
          <>
            <td>{item.fullname}</td>
            <td>{item.username}</td>
            <td>{item.role}</td>
            <td>{new Date(item.archived_at).toLocaleDateString()}</td>
          </>
        )}

        {activeTab === "menus" && (
          <>
            <td>{item.item_name}</td>
            <td>{item.category}</td>
            <td>₱{item.price}</td>
            <td>{new Date(item.archived_at).toLocaleDateString()}</td>
          </>
        )}

        {activeTab === "inventories" && (
          <>
            <td>{item.item}</td>
            <td>{item.category}</td>
            <td>
              {item.quantity} {item.unit}
            </td>
            <td>{new Date(item.archived_at).toLocaleDateString()}</td>
          </>
        )}

        <td className="action-buttons">
          <button
            className="btn-restore"
            onClick={() => handleRestore(item.id, type)}
            title="Restore this item"
          >
            <RotateCcw size={18} />
          </button>

          {/* Only show delete button for menus and inventory, NOT for accounts */}
          {activeTab !== "accounts" && (
            <button
              className="btn-delete"
              onClick={() => handleDelete(item.id, type)}
              title="Delete permanently"
            >
              <Trash2 size={18} />
            </button>
          )}
        </td>
      </tr>
    ));
  };

  return (
    <div className="archives-container">
      <div className="archives-header">
        <h1>Archives</h1>
        <p>Manage archived accounts, menus, and inventory items</p>
      </div>

      <div className="archives-tabs">
        <button
          className={`tab-button ${activeTab === "accounts" ? "active" : ""}`}
          onClick={() => setActiveTab("accounts")}
        >
          Accounts
        </button>
        <button
          className={`tab-button ${activeTab === "menus" ? "active" : ""}`}
          onClick={() => setActiveTab("menus")}
        >
          Menus
        </button>
        <button
          className={`tab-button ${
            activeTab === "inventories" ? "active" : ""
          }`}
          onClick={() => setActiveTab("inventories")}
        >
          Inventory
        </button>
      </div>

      <div className="archives-content">
        <div className="archive-table-container">
          <table className="archive-table">
            <thead>
              <tr>
                {getTableHeaders().map((header, index) => (
                  <th key={index}>{header}</th>
                ))}
              </tr>
            </thead>
            <tbody>{renderTableRows()}</tbody>
          </table>
        </div>

        {getArchivedData().length === 0 && (
          <div className="empty-state">
            <p>No archived {activeTab} found.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Archives;