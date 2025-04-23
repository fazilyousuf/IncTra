IncTra.
a Personal Budget Tracker
-------------------------

The Personal Budget Tracker is a full-stack web application that allows users to manage their personal finances efficiently. It includes features to track income and expenses, monitor account balances, manage budgets, and visualize financial data through interactive charts. The app is built using Django and Django REST Framework for the backend, and React and CSS for the frontend.

Link: https://inctra-frontend.onrender.com/
-------------------------------------------
test credentials 
----------------
username: fazil
passw*rd: fazil
---------------
Authentication
Secure login system using Django REST Framework Authentication.
Only authenticated users can add, view, or delete transactions and budgets.


Features by Page

📌 1. Dashboard
📈 Pie Chart: Shows this month's expense and income compared with the allocated budget.

📊 Bar Chart: Displays income vs. expenses for the last 5 days.

📉 Line Chart: Visualizes credit card usage over time.

💰 Summary Cards: Shows total income, total expenses, and current balance.

📌 2. Transaction Page
➕ Add or 🗑️ delete transactions categorized as income or expense.

💼 Each transaction is tagged with category and account/credit card.

📜 Full transaction history with amount, date, category, and time.


📌 3. Account Management
🏦 Manage individual bank account balances.

💳 Track and update credit card balances.

🚫 Set spending limits for credit cards.

📌 4. Budget Page
🎯 Allocate budget amounts per category.

📊 View a total of all budget allocations.

📉 Visual compare of spent vs allocated.

📌 5. Signout
✅ Clears authentication token and redirects to login.
