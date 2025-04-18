import { NavLink } from 'react-router-dom';
import '../styles/Sidebar.css';

const Sidebar = () => {
  return (
    <nav className="sidebar">
      <h1 className="logo">IncTra.</h1>
      <div className="nav-menu">
        <NavLink 
          to="/" 
          className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}
        >
          Dashboard
        </NavLink>
        <NavLink 
          to="/transactions" 
          className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}
        >
          Transactions
        </NavLink>
        <NavLink 
          to="/accounts" 
          className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}
        >
          Accounts
        </NavLink>
        <NavLink 
          to="/budgets" 
          className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}
        >
          Budgets
        </NavLink>
        <NavLink 
          to="/settings" 
          className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}
        >
          Settings
        </NavLink>
      </div>
    </nav>
  );
};

export default Sidebar;