import React, { useState } from "react";
import "../styles/TransactionPage.css";

const TransactionItem = ({ category, amount, date, type, accountType }) => (
  <div className="transaction-item">
    <div className="transaction-item-category">
      <span>{category}</span>
    </div>
    <div className="transaction-item-details">
      <div className={`transaction-amount ${type}`}>
        {type === "income" ? "+" : "-"}${Math.abs(amount).toFixed(2)}
      </div>
      <div className="transaction-meta">
        <span className="transaction-date">
          {new Date(date).toLocaleDateString("en-US", {
            month: "2-digit",
            day: "2-digit",
            year: "numeric",
          })}
        </span>
        <span className="transaction-account">{accountType}</span>
      </div>
    </div>
  </div>
);

const TransactionsPage = () => {
  const [transactions, setTransactions] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTransaction, setNewTransaction] = useState({
    category: "",
    amount: "",
    date: "",
    type: "expense",
    accountType: "Bank Account",
  });

  const incomeCategories = ["Salary", "Investment", "Assets", "Business", "Others"];
  const expenseCategories = ["Credit Card Bill","Food", "Home", "Transportation", "Entertainment", "Shopping", "Others"];

  const handleAddTransaction = () => {
    if (
      newTransaction.category &&
      newTransaction.amount &&
      newTransaction.date &&
      newTransaction.accountType
    ) {
      setTransactions([
        ...transactions,
        {
          id: transactions.length + 1,
          ...newTransaction,
          amount: parseFloat(newTransaction.amount),
        },
      ]);
      setShowAddModal(false);
      setNewTransaction({
        category: "",
        amount: "",
        date: "",
        type: "expense",
        accountType: "Bank Account",
      });
    }
  };

  const totalAmount = transactions.reduce((sum, transaction) => {
    return transaction.type === "income"
      ? sum + transaction.amount
      : sum - transaction.amount;
  }, 0);

  return (
    <div className="main-content1">
      <div className="dashboard-header">
        <h3 style={{ color: '#ffff', paddingLeft: '30px' }}>Transactions</h3>
        <div className="floating-buttons-container">
          <button
            className="floating-button add"
            onClick={() => {
              setNewTransaction({
                category: "",
                amount: "",
                date: "",
                type: "income",
                accountType: "Bank Account",
              });
              setShowAddModal(true);
            }}
          >
            <span className="floating-button-icon">+</span>
          </button>
          <button
            className="floating-button subtract"
            onClick={() => {
              setNewTransaction({
                category: "",
                amount: "",
                date: "",
                type: "expense",
                accountType: "Bank Account",
              });
              setShowAddModal(true);
            }}
          >
            <span className="floating-button-icon">-</span>
          </button>
        </div>
      </div>

      <div className="transactions-container">
        <div className="transactions-wrapper">
          <div className="transactions-header">
            <div className="transactions-title">
              <span>Transactions</span>
              <span className="transactions-count">({transactions.length})</span>
            </div>
            <div className="total-amount">
              <span>Total:</span>
              <span className={`total-value ${totalAmount >= 0 ? "positive" : "negative"}`}>
                ${Math.abs(totalAmount).toFixed(2)}
              </span>
            </div>
          </div>

          <div className="transactions-list">
            {transactions.map((transaction) => (
              <TransactionItem
                key={transaction.id}
                category={transaction.category}
                amount={transaction.amount}
                date={transaction.date}
                type={transaction.type}
                accountType={transaction.accountType}
              />
            ))}
          </div>
        </div>
      </div>

      {showAddModal && (
        <div className="add-modal-overlay">
          <div className="add-modal-content">
            <h3>Add {newTransaction.type === "income" ? "Income" : "Expense"}</h3>
            <div className="modal-input-group">
              <select
                className="modal-input"
                value={newTransaction.category}
                onChange={(e) =>
                  setNewTransaction({
                    ...newTransaction,
                    category: e.target.value,
                  })
                }
                required
              >
                <option value="" disabled>Select a category</option>
                {(newTransaction.type === "income" ? incomeCategories : expenseCategories).map((category) => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
            <div className="modal-input-group">
              <input
                type="number"
                placeholder="Amount"
                className="modal-input"
                value={newTransaction.amount}
                onChange={(e) =>
                  setNewTransaction({
                    ...newTransaction,
                    amount: e.target.value,
                  })
                }
                min="0"
                step="0.01"
              />
            </div>
            <div className="modal-input-group">
              <input
                type="date"
                className="modal-input"
                value={newTransaction.date}
                onChange={(e) =>
                  setNewTransaction({ ...newTransaction, date: e.target.value })
                }
                required
              />
            </div>
            <div className="modal-input-group">
              <select
                className="modal-input"
                value={newTransaction.accountType}
                onChange={(e) =>
                  setNewTransaction({
                    ...newTransaction,
                    accountType: e.target.value,
                  })
                }
                required
              >
                <option value="Bank Account">Bank Account</option>
                <option value="Credit Card">Credit Card</option>
              </select>
            </div>
            <div className="modal-button-group">
              <button
                className="modal-button confirm"
                onClick={handleAddTransaction}
              >
                Add
              </button>
              <button
                className="modal-button cancel"
                onClick={() => setShowAddModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TransactionsPage;