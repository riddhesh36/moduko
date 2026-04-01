import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export default function Navbar() {
    const { user, role, logout } = useAuth()
    const navigate = useNavigate()
    const [isMenuOpen, setIsMenuOpen] = useState(false)

    function closeMenu() {
        setIsMenuOpen(false)
    }

    async function handleLogout() {
        await logout()
        closeMenu()
        navigate('/login')
    }

    if (!user) return null

    return (
        <nav className="navbar">
            <div className="navbar-header">
                <div className="navbar-brand">
                    <img src="/modak.png" alt="Modak" className="modak-icon" style={{ height: '1.25em' }} />
                    <span>Modak Orders</span>
                </div>
                <button
                    className="hamburger-btn"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    aria-label="Toggle menu"
                >
                    {isMenuOpen ? '✕' : '☰'}
                </button>
            </div>

            <div className={`navbar-menu ${isMenuOpen ? 'open' : ''}`}>
                <div className="navbar-nav">
                    {role === 'accountant' && (
                        <>
                            <NavLink
                                to="/accountant"
                                end
                                onClick={closeMenu}
                                className={({ isActive }) => `navbar-link ${isActive ? 'active' : ''}`}
                            >
                                Dashboard
                            </NavLink>
                            <NavLink
                                to="/accountant/new"
                                onClick={closeMenu}
                                className={({ isActive }) => `navbar-link ${isActive ? 'active' : ''}`}
                            >
                                ➕ New Order
                            </NavLink>
                            <NavLink
                                to="/accountant/orders"
                                onClick={closeMenu}
                                className={({ isActive }) => `navbar-link ${isActive ? 'active' : ''}`}
                            >
                                My Orders
                            </NavLink>
                        </>
                    )}
                    {role === 'admin' && (
                        <NavLink
                            to="/admin"
                            onClick={closeMenu}
                            className={({ isActive }) => `navbar-link ${isActive ? 'active' : ''}`}
                        >
                            Dashboard
                        </NavLink>
                    )}
                </div>
                <div className="navbar-right">
                    <span className="navbar-role">{role}</span>
                    <button className="btn btn-ghost btn-sm" onClick={handleLogout}>
                        Logout
                    </button>
                </div>
            </div>
        </nav>
    )
}

