const TransactionsPage = () => {
    return (
        <div className="dashboard-header">
            <h3 style={{
                color: '#ffff',
                paddingLeft: '30px',
                }}>Transactions</h3>
                <div className="floating-buttons-container">
                <button className="floating-button add" onClick={() => {}}>
                <span className="floating-button-icon">+</span>
                </button>
                <button className="floating-button subtract" onClick={() => {}}>
                <span className="floating-button-icon">-</span>
                </button>
            </div>
      </div>
    );
  };
  
  export default TransactionsPage;