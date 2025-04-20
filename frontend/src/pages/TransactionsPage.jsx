import React, { useState } from "react";

// Transaction component for individual items
const TransactionItem = ({ category, amount, date, type }) => (
  <div
    style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "12px 20px",
      borderBottom: "1px solid #444",
      backgroundColor: "#2D2D2D",
    }}
  >
    <div style={{ flex: 1 }}>
      <span style={{ color: "white", fontSize: "1rem" }}>{category}</span>
    </div>
    <div style={{ textAlign: "right" }}>
      <div
        style={{
          color: type === "income" ? "#48BB78" : "#F56565",
          fontWeight: "500",
          fontSize: "1.1rem",
        }}
      >
        {type === "income" ? "+" : "-"}${Math.abs(amount).toFixed(2)}
      </div>
      <div
        style={{
          color: "#A0AEC0",
          fontSize: "0.8rem",
          marginTop: "4px",
        }}
      >
        {new Date(date).toLocaleDateString("en-US", {
          month: "2-digit",
          day: "2-digit",
          year: "numeric",
        })}
      </div>
    </div>
  </div>
);

const TransactionsPage = () => {
  const [transactions, setTransactions] = useState([
    {
      id: 1,
      category: "Clothing (Refund)",
      amount: 90.0,
      date: "2025-04-17",
      type: "income",
    },
    {
      id: 2,
      category: "Bar",
      amount: 2.0,
      date: "2025-04-17",
      type: "expense",
    },
    // Add more mock transactions here
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [newTransaction, setNewTransaction] = useState({
    category: "",
    amount: "",
    date: "",
    type: "expense",
  });

  const handleAddTransaction = () => {
    if (
      newTransaction.category &&
      newTransaction.amount &&
      newTransaction.date
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
      });
    }
  };

  const totalAmount = transactions.reduce((sum, transaction) => {
    return transaction.type === "income"
      ? sum + transaction.amount
      : sum - transaction.amount;
  }, 0);

  return (
    <div className="main-content">
      {/* Fixed Header */}
      <div className="dashboard-header">
        <h3 style={{ color: "#ffff", paddingLeft: "30px" }}>Transactions</h3>

        <div className="floating-buttons-container">
          <button
            className="floating-button add"
            onClick={() => setShowAddModal(true)}
          >
            <span className="floating-button-icon">+</span>
          </button>
          <button className="floating-button subtract" onClick={() => {}}>
            <span className="floating-button-icon">-</span>
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div
        className="page-container"
        style={{
          padding: "0px",
          height: "calc(100vh - 80px)", // Adjust height accounting for headers
          display: "flex",
          flexDirection: "column",  
          alignItems:'center'
        }}
      >
        <div style={{ 
    width: "90%",
    maxWidth: "800px",
    height: "100%",
    display: "flex",
    flexDirection: "column"
  }}>
    {/* Header Section */}
    <div style={{ 
      backgroundColor: "#3D3D3D",
      padding: "15px 20px",
      borderRadius: "8px",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      color: "white",
      marginBottom: "5px"
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <span style={{ fontSize: "1.1rem", fontWeight: "500" }}>Transactions</span>
        <span style={{ color: "#A0AEC0", fontSize: "0.9rem" }}>
          ({transactions.length})
        </span>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <span>Total:</span>
        <span style={{
          color: totalAmount >= 0 ? "#48BB78" : "#F56565",
          fontWeight: "600",
          fontSize: "1.2rem",
        }}>
          ${Math.abs(totalAmount).toFixed(2)}
        </span>
      </div>
    </div>

    {/* Transactions List */}
    <div style={{ 
      backgroundColor: "#2D2D2D",
      borderRadius: "8px",
      flex: 1,
      overflow: "auto",
    }}>
      {transactions.map((transaction) => (
        <TransactionItem
          key={transaction.id}
          category={transaction.category}
          amount={transaction.amount}
          date={transaction.date}
          type={transaction.type}
        />
      ))}
    </div>
    </div>
    </div>

      {/* Add Transaction Modal */}
      {showAddModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              backgroundColor: "#2D2D2D",
              padding: "25px",
              borderRadius: "8px",
              width: "90%",
              maxWidth: "400px",
            }}
          >
            <h3 style={{ color: "white", marginBottom: "20px" }}>
              Add Transaction
            </h3>

            <div style={{ marginBottom: "15px" }}>
              <input
                type="text"
                placeholder="Category"
                style={{
                  width: "100%",
                  padding: "10px",
                  borderRadius: "4px",
                  border: "none",
                  backgroundColor: "#3D3D3D",
                  color: "white",
                }}
                value={newTransaction.category}
                onChange={(e) =>
                  setNewTransaction({
                    ...newTransaction,
                    category: e.target.value,
                  })
                }
              />
            </div>

            <div style={{ marginBottom: "15px" }}>
              <input
                type="number"
                placeholder="Amount"
                style={{
                  width: "100%",
                  padding: "10px",
                  borderRadius: "4px",
                  border: "none",
                  backgroundColor: "#3D3D3D",
                  color: "white",
                }}
                value={newTransaction.amount}
                onChange={(e) =>
                  setNewTransaction({
                    ...newTransaction,
                    amount: e.target.value,
                  })
                }
              />
            </div>

            <div style={{ marginBottom: "15px" }}>
              <input
                type="date"
                style={{
                  width: "100%",
                  padding: "10px",
                  borderRadius: "4px",
                  border: "none",
                  backgroundColor: "#3D3D3D",
                  color: "white",
                }}
                value={newTransaction.date}
                onChange={(e) =>
                  setNewTransaction({ ...newTransaction, date: e.target.value })
                }
              />
            </div>

            <div style={{ marginBottom: "20px" }}>
              <select
                style={{
                  width: "100%",
                  padding: "10px",
                  borderRadius: "4px",
                  border: "none",
                  backgroundColor: "#3D3D3D",
                  color: "white",
                }}
                value={newTransaction.type}
                onChange={(e) =>
                  setNewTransaction({ ...newTransaction, type: e.target.value })
                }
              >
                <option value="expense">Expense</option>
                <option value="income">Income</option>
              </select>
            </div>

            <div style={{ display: "flex", gap: "10px" }}>
              <button
                style={{
                  flex: 1,
                  padding: "10px",
                  backgroundColor: "#48BB78",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
                onClick={handleAddTransaction}
              >
                Add
              </button>
              <button
                style={{
                  flex: 1,
                  padding: "10px",
                  backgroundColor: "#F56565",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
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
