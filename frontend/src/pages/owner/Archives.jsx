import { ArrowLeft, RotateCcw, Trash2 } from "lucide-react";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../Style/Archives.css";

function Archives() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("accounts");

  const archivedAccounts = [
    { id: 1, name: "John Doe", email: "john@example.com", archivedDate: "2024-01-15", role: "Manager" },
    { id: 2, name: "Jane Smith", email: "jane@example.com", archivedDate: "2024-01-10", role: "Staff" },
    { id: 3, name: "Bob Wilson", email: "bob@example.com", archivedDate: "2024-01-05", role: "Cashier" }
  ];

  const archivedMenus = [
    { id: 1, name: "Seasonal Salad", category: "Appetizers", price: "$8.99", archivedDate: "2024-01-12" },
    { id: 2, name: "Chocolate Volcano", category: "Desserts", price: "$6.99", archivedDate: "2024-01-08" },
    { id: 3, name: "Mango Smoothie", category: "Beverages", price: "$4.99", archivedDate: "2024-01-03" }
  ];

  const archivedInventories = [
    { id: 1, name: "Fresh Basil", category: "Herbs", quantity: "0 kg", archivedDate: "2024-01-14" },
    { id: 2, name: "Mango Pulp", category: "Fruits", quantity: "0 cans", archivedDate: "2024-01-09" },
    { id: 3, name: "Special Sauce", category: "Condiments", quantity: "0 bottles", archivedDate: "2024-01-04" }
  ];

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
        return ["Name", "Email", "Role", "Archived Date", "Actions"];
      case "menus":
        return ["Item Name", "Category", "Price", "Archived Date", "Actions"];
      case "inventories":
        return ["Item Name", "Category", "Quantity", "Archived Date", "Actions"];
      default:
        return [];
    }
  };

  const handleRestore = (id, type) => {
    console.log(`Restoring ${type} with ID: ${id}`);
  };

  const handleDelete = (id, type) => {
    if (window.confirm(`Are you sure you want to permanently delete this ${type}? This action cannot be undone.`)) {
      console.log(`Deleting ${type} with ID: ${id}`);
    }
  };

  const renderTableRows = () => {
    const data = getArchivedData();
    const type = activeTab.slice(0, -1); 

    return data.map((item) => (
      <tr key={item.id} className="archive-row">
        <td>{item.name}</td>
        <td>{item.email || item.category}</td>
        <td>{item.role || item.price || item.quantity}</td>
        <td>{item.archivedDate}</td>
        <td className="action-buttons">
          <button 
            className="btn-restore"
            onClick={() => handleRestore(item.id, type)}
          >
            <RotateCcw size={16} />
          </button>
          <button 
            className="btn-delete"
            onClick={() => handleDelete(item.id, type)}
          >
            <Trash2 size={16} />
          </button>
        </td>
      </tr>
    ));
  };

  return (
    <div className="archives-container">
      <button className="btn-back" onClick={() => navigate("/Settings")}>
        <ArrowLeft size={20} />
        Back
      </button>
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
          className={`tab-button ${activeTab === "inventories" ? "active" : ""}`}
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
            <tbody>
              {renderTableRows()}
            </tbody>
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