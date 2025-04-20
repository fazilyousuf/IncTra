import React, { useEffect, useState } from 'react';

const AccountsPage = () => {
    const [bankAccounts, setBankAccounts] = useState([]);
    const [creditCards, setCreditCards] = useState([]);
    const [showAddMoneyModal, setShowAddMoneyModal] = useState(false);
    const [selectedAccount, setSelectedAccount] = useState(null);
    const [amount, setAmount] = useState('');

    useEffect(()=>{
      const fetchData = async()=>{
        const Accesstoken = localStorage.getItem('token')
        try {
          const response = await fetch('http://127.0.0.1:8000/tracker/accounts/', {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${Accesstoken}`
            },
          });
      
          if (response.ok) {
            const result = await response.json();
            const data = result[0]
            console.log(data)
            console.log("Login successful:", result);
          } else {
            alert("Something went wrong! Please try again");
          }
        } catch (error) {
          console.error("Login error:", error);
          alert("Something went wrong. Please try again.");
        }
      }
      fetchData()
    },[])
  
    const handleAddBankAccount = () => {
      if (bankAccounts.length === 0) {
        const newAccount = {
          id: 1,
          name: `Bank Account`,
          balance: 0,
          type: 'bank'
        };
        setBankAccounts([newAccount]);
      }
    };
  
    const handleAddCreditCard = () => {
      if (creditCards.length === 0) {
        const newCard = {
          id: 1,
          name: `Credit Card`,
          balance: 0,
          type: 'credit'
        };
        setCreditCards([newCard]);
      }
    };
  
    const handleDeleteAccount = (type) => {
      if (type === 'bank') {
        setBankAccounts([]);
      } else {
        setCreditCards([]);
      }
    };
  
    const handleAddMoney = (account) => {
      setSelectedAccount(account);
      setShowAddMoneyModal(true);
    };
  
    const handleMoneySubmit = () => {
      if (selectedAccount && amount) {
        const updateBalance = (prev) => 
          prev.map(item => 
            item.id === selectedAccount.id 
              ? {...item, balance: item.balance + parseFloat(amount)} 
              : item
          );
        
        if (selectedAccount.type === 'bank') {
          setBankAccounts(updateBalance);
        } else {
          setCreditCards(updateBalance);
        }
        
        setShowAddMoneyModal(false);
        setAmount('');
      }
    };

    return (
        <div className="main-content">
      <div className="dashboard-header">
        <h3 style={{ color: '#ffff', paddingLeft: '30px' }}>Accounts</h3>
      </div>

      <div className="page-container" style={{ padding: '20px' }}>
        {/* Bank Accounts Section */}
        <div style={{ 
          backgroundColor: '#2D2D2D',
          borderRadius: '8px',
          padding: '20px',
          marginBottom: '20px'
        }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            marginBottom: '15px'
          }}>
            <h4 style={{ color: 'white' }}>Bank Accounts</h4>
            <button 
              className="floating-button add"
              onClick={handleAddBankAccount}
              style={{ 
                width: '40px', 
                height: '40px',
                opacity: bankAccounts.length ? 0.5 : 1,
                cursor: bankAccounts.length ? 'not-allowed' : 'pointer'
              }}
              disabled={bankAccounts.length > 0}
            >
              <span className="floating-button-icon">+</span>
            </button>
          </div>

          {bankAccounts.map(account => (
            <div key={account.id} style={{ 
              backgroundColor: '#3D3D3D',
              padding: '15px',
              borderRadius: '6px',
              marginBottom: '10px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div>
                <div style={{ color: 'white' }}>{account.name}</div>
                <div style={{ color: '#A0AEC0', fontSize: '0.9rem' }}>
                  Balance: ${account.balance.toFixed(2)}
                </div>
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button 
                  onClick={() => handleAddMoney(account)}
                  style={{
                    padding: '8px 15px',
                    backgroundColor: '#48BB78',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  Add Money
                </button>
                <button 
                  onClick={() => handleDeleteAccount('bank')}
                  style={{
                    padding: '8px 15px',
                    backgroundColor: '#F56565',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Credit Cards Section */}
        <div style={{ 
          backgroundColor: '#2D2D2D',
          borderRadius: '8px',
          padding: '20px'
        }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            marginBottom: '15px'
          }}>
            <h4 style={{ color: 'white' }}>Credit Cards</h4>
            <button 
              className="floating-button add"
              onClick={handleAddCreditCard}
              style={{ 
                width: '40px', 
                height: '40px',
                opacity: creditCards.length ? 0.5 : 1,
                cursor: creditCards.length ? 'not-allowed' : 'pointer'
              }}
              disabled={creditCards.length > 0}
            >
              <span className="floating-button-icon">+</span>
            </button>
          </div>

          {creditCards.map(card => (
            <div key={card.id} style={{ 
              backgroundColor: '#3D3D3D',
              padding: '15px',
              borderRadius: '6px',
              marginBottom: '10px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div>
                <div style={{ color: 'white' }}>{card.name}</div>
                <div style={{ color: '#A0AEC0', fontSize: '0.9rem' }}>
                  Balance: ${card.balance.toFixed(2)}
                </div>
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button 
                  onClick={() => handleAddMoney(card)}
                  style={{
                    padding: '8px 15px',
                    backgroundColor: '#48BB78',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  Add Money
                </button>
                <button 
                  onClick={() => handleDeleteAccount('credit')}
                  style={{
                    padding: '8px 15px',
                    backgroundColor: '#F56565',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Add Money Modal */}
        {showAddMoneyModal && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
          }}>
            <div style={{
              backgroundColor: '#2D2D2D',
              padding: '25px',
              borderRadius: '8px',
              width: '90%',
              maxWidth: '400px'
            }}>
              <h3 style={{ color: 'white', marginBottom: '20px' }}>
                Add Money to {selectedAccount?.name}
              </h3>

              <div style={{ marginBottom: '15px' }}>
                <input
                  type="number"
                  placeholder="Amount"
                  style={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: '4px',
                    border: 'none',
                    backgroundColor: '#3D3D3D',
                    color: 'white'
                  }}
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  style={{
                    flex: 1,
                    padding: '10px',
                    backgroundColor: '#48BB78',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                  onClick={handleMoneySubmit}
                >
                  Add
                </button>
                <button
                  style={{
                    flex: 1,
                    padding: '10px',
                    backgroundColor: '#F56565',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                  onClick={() => setShowAddMoneyModal(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      </div>
    );
  };
  
  export default AccountsPage;