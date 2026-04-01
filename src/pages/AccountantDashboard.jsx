import { Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useOrders } from '../hooks/useOrders'

export default function AccountantDashboard() {
    const { user } = useAuth()
    const { orders, loading } = useOrders({ userId: user?.id, roleFilter: 'accountant' })

    const today = new Date().toISOString().split('T')[0]
    const todayOrders = orders.filter(o => o.delivery_date === today)
    const totalOrders = orders.length

    return (
        <div className="page-container">
            <div className="welcome-banner">
                <h1>Welcome back! 👋</h1>
                <p>Ready to log some delicious modak orders today?</p>
            </div>

            <div className="quick-actions">
                <Link to="/accountant/new" className="quick-action-card" id="new-order-btn">
                    <div className="quick-action-icon">📝</div>
                    <div className="quick-action-text">
                        <h3>New Order</h3>
                        <p>Create a new customer order</p>
                    </div>
                </Link>
                <Link to="/accountant/orders" className="quick-action-card" id="my-orders-btn">
                    <div className="quick-action-icon">📋</div>
                    <div className="quick-action-text">
                        <h3>My Orders</h3>
                        <p>View all orders you've entered</p>
                    </div>
                </Link>
            </div>

            <div className="stats-grid stats-grid-3">
                <div className="stat-card">
                    <div className="stat-icon">📦</div>
                    <div className="stat-value" style={{ color: 'var(--primary)' }}>{totalOrders}</div>
                    <div className="stat-label">Total Orders</div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon">📅</div>
                    <div className="stat-value" style={{ color: '#1565C0' }}>{todayOrders.length}</div>
                    <div className="stat-label">Today's Orders</div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon">📊</div>
                    <div className="stat-value" style={{ color: 'var(--success)' }}>
                        {orders.reduce((sum, o) => sum + o.quantity, 0)}
                    </div>
                    <div className="stat-label">Total Boxes</div>
                </div>
            </div>

            {loading && (
                <div className="loading-container">
                    <div className="spinner"></div>
                    <div className="loading-text">Loading your orders...</div>
                </div>
            )}
        </div>
    )
}
