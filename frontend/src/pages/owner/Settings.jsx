import { useState } from "react";
import { Trash2 } from "lucide-react";
import "../../Style/Settings.css";

function Settings() {
    const [accounts, setAccounts] = useState([]);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false); // ✅ for delete confirmation
    const [accountToDelete, setAccountToDelete] = useState(null); // ✅ store account to delete
    const [formData, setFormData] = useState({ username: "", password: "" });

    const handleCreateAccount = (e) => {
        e.preventDefault();
        if (formData.username && formData.password) {
            const newAccount = {
                id: Date.now(),
                username: formData.username,
                password: formData.password,
                createdAt: new Date().toLocaleDateString(),
            };
            setAccounts([...accounts, newAccount]);
            setFormData({ username: "", password: "" });
            setShowCreateModal(false);
        }
    };

    const handleDeleteClick = (account) => {
        setAccountToDelete(account);
        setShowDeleteModal(true);
    };

    const confirmDelete = () => {
        setAccounts(accounts.filter((acc) => acc.id !== accountToDelete.id));
        setAccountToDelete(null);
        setShowDeleteModal(false);
    };

    return (
        <div className="settings-container">
            <div className="settings">
                <h2>Settings</h2>
                <p className="settings-subtitle">Manage your accounts</p>
            </div>

            <div className="settings-option">
                <button
                    className="btn-create"
                    onClick={() => setShowCreateModal(true)}
                >
                    Create Account
                </button>
            </div>

            {/* Accounts List */}
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
                                    <small>Password: {account.password}</small>
                                    <small>Created: {account.createdAt}</small>
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

            {/* ✅ Create Account Modal */}
            {showCreateModal && (
                <div
                    className="modal-overlay"
                    onClick={() => setShowCreateModal(false)}
                >
                    <div
                        className="modal"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h3>Create New Account</h3>
                        <form onSubmit={handleCreateAccount}>
                            <div className="form-group">
                                <label>Username</label>
                                <input
                                    type="text"
                                    value={formData.username}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            username: e.target.value,
                                        })
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
                                        setFormData({
                                            ...formData,
                                            password: e.target.value,
                                        })
                                    }
                                    placeholder="Enter password"
                                    required
                                />
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

            {/* ✅ Delete Confirmation Modal */}
            {showDeleteModal && (
                <div
                    className="modal-overlay"
                    onClick={() => setShowDeleteModal(false)}
                >
                    <div
                        className="modal"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h3>Confirm Delete</h3>
                        <p>Are you sure you want to delete <strong>{accountToDelete?.username}</strong>?</p>
                        <div className="warning-text">
                            ⚠️ This action cannot be undone.
                        </div>
                        <div className="modal-actions">
                            <button
                                onClick={() => setShowDeleteModal(false)}
                                className="btn-cancel"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmDelete}
                                className="btn-delete-confirm"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Settings;
