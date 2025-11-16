import { useState, useEffect } from "react";
import { Trash2 } from "lucide-react";
import axios from "axios";
import "../../Style/EditAcc.css";

function EditAcc() {
  const [accounts, setAccounts] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [accountToDelete, setAccountToDelete] = useState(null);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    name: "",
    first_name: "",
    role: "staff",
  });

  const API_BASE = import.meta.env.VITE_API_BASE_URL;

  const fetchAccounts = async () => {
    try {
      const res = await axios.get(`${API_BASE}/auth/users`);
      setAccounts(res.data);
    } catch (err) {
      console.log("Error fetching accounts:", err);
    }
  };

  const handleCreateAccount = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_BASE}/auth/register`, formData);
      if (res.data.success) {
        setFormData({ username: "", password: "", role: "staff", name: "" });
        setShowCreateModal(false);
        fetchAccounts();
      } else {
        alert(res.data.message || "Failed to create account");
      }
    } catch (err) {
      console.log(err);
      alert("Server error");
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  const handleDeleteClick = (account) => {
    setAccountToDelete(account);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(`${API_BASE}/auth/${accountToDelete.id}`);
      setAccounts(accounts.filter((acc) => acc.id !== accountToDelete.id));
      setShowDeleteModal(false);
      setAccountToDelete(null);
    } catch (err) {
      console.log(err);
      alert("Error in deleting an account");
    }
  };

  return (
    <div className="createacc-container">
      <div className="createacc-header">
        <h2>Create Account</h2>
        <p className="createacc-subtitle">Manage your accounts</p>
      </div>

      <div className="createacc-option">
        <button className="btn-create" onClick={() => setShowCreateModal(true)}>
          Add Account
        </button>
      </div>

      <div className="accounts-list">
        <h3>Current Accounts ({accounts.length})</h3>
        {accounts.length === 0 ? (
          <p className="no-accounts">No accounts created yet</p>
        ) : (
          <div className="account-cards">
            {accounts.map((account) => (
              <div key={account.id} className="account-card">
                <div className="account-info">
                  <strong>{account.username}</strong>
                  <small>Role: {account.role}</small>
                  <small>Name: {account.name}</small>
                </div>
                <Trash2
                  className="trash-icon"
                  size={20}
                  onClick={() => handleDeleteClick(account)}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {showCreateModal && (
        <div
          className="modal-overlay"
          onClick={() => setShowCreateModal(false)}
        >
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>Create New Account</h3>
            <form onSubmit={handleCreateAccount}>
              <div className="form-group">
                <label>Username</label>
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) =>
                    setFormData({ ...formData, username: e.target.value })
                  }
                  placeholder="Enter username"
                  required
                />
              </div>
              <div className="form-group">
                <label>Password</label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  placeholder="Enter password"
                  required
                />
              </div>
              <div className="form-group">
                <label>Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="Enter name"
                  required
                />
              </div>
              <div className="form-group">
                <label>First Name</label>
                <input
                  type="text"
                  value={formData.first_name}
                  onChange={(e) =>
                    setFormData({ ...formData, first_name: e.target.value })
                  }
                  placeholder="Enter first name"
                  required
                />
              </div>

              <div className="form-group">
                <label>Select Role</label>
                <select
                  value={formData.role}
                  onChange={(e) =>
                    setFormData({ ...formData, role: e.target.value })
                  }
                  required
                >
                  <option value="owner">Owner</option>
                  <option value="staff">Staff</option>
                </select>
              </div>
              <div className="modal-actions">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="btn-cancel"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-submit">
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showDeleteModal && (
        <div
          className="modal-overlay"
          onClick={() => setShowDeleteModal(false)}
        >
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>Confirm Delete</h3>
            <p>
              Are you sure you want to delete{" "}
              <strong>{accountToDelete?.username}</strong>?
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

export default EditAcc;
