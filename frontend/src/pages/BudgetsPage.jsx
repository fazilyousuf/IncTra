    import React, { useState, useEffect } from 'react';
    import axios from 'axios';
    import '../styles/BudgetPage.css';

    const BudgetsPage = () => {
        const [budgets, setBudgets] = useState([]);
        const [total, setTotal] = useState(0);
        const categories = ['Food', 'Entertainment', 'Transportation', 'Health', 'Shopping', 'Home', 'Others'];

        useEffect(() => {
            fetchBudgets();
        }, []);

        const fetchBudgets = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://127.0.0.1:8000/tracker/budgets/', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setBudgets(response.data);
                calculateTotal(response.data);
            } catch (error) {
                console.error('Error fetching budgets:', error);
            }
        };

        const calculateTotal = (budgets) => {
            const sum = budgets.reduce((acc, curr) => acc + Number(curr.allocated_amount || 0), 0);
            setTotal(sum);
        };

        const handleAllocation = async (category, amount) => {
            try {
                const token = localStorage.getItem('token');
                await axios.post('http://127.0.0.1:8000/tracker/budgets/', {
                    category,
                    allocated_amount: parseFloat(amount)
                }, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                fetchBudgets();
            } catch (error) {
                console.error('Error setting budget:', error);
            }
        };

        return (
            <div className="dashboard-header">
                <h3 style={{ color: '#ffff', paddingLeft: '30px' }}>Budgets</h3>
                <div className="budgets-container">
                    {categories.map(category => (
                        <BudgetItem 
                            key={category}
                            category={category}
                            allocated={budgets.find(b => b.category === category)?.allocated_amount || 0}
                            onSet={handleAllocation}
                        />
                    ))}
                    <div className="budget-total">
                        <span>Total Allocated</span>
                        <span>${Number(total || 0).toFixed(2)}</span>
                    </div>
                </div>
            </div>
        );
    };

    const BudgetItem = ({ category, allocated, onSet }) => {
        const [amount, setAmount] = useState('');
        const [showForm, setShowForm] = useState(false);

        const handleSubmit = (e) => {
            e.preventDefault();
            if (amount) {
                onSet(category, amount);
                setAmount('');
                setShowForm(false);
            }
        };

        return (
            <div className="budget-item">
                <span className="category-name">{category}</span>
                <span className="allocated-amount">${Number(allocated || 0).toFixed(2)}</span>
                {!showForm ? (
                    <button 
                        className="toggle-button"
                        onClick={() => setShowForm(true)}
                    >
                        Set
                    </button>
                ) : (
                    <form onSubmit={handleSubmit} className="allocation-form">
                        <input
                            type="number"
                            step="0.01"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder="Enter amount"
                            autoFocus
                        />
                        <button type="submit">Submit</button>
                    </form>
                )}
            </div>
        );
    };

    export default BudgetsPage;