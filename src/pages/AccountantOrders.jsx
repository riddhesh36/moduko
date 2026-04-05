import { useAuth } from '../hooks/useAuth'
import { useOrders } from '../hooks/useOrders'
import StatusBadge from '../components/StatusBadge'

export default function AccountantOrders() {
    const { user } = useAuth()
    const { orders, loading } = useOrders({ userId: user?.id, roleFilter: 'accountant' })

    function formatDate(dateStr) {
        return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        })
    }

    const boxEmoji = { classic: <img src="/modak.png" alt="Classic" className="modak-icon" />, delight: '🎁', celebration: '🎊' }

    return (
        <div className="page-container">
            <div className="page-header">
                <h1>📋 My Orders</h1>
                <p>All orders you've entered (read-only)</p>
            </div>

            {loading ? (
                <div className="loading-container">
                    <div className="spinner"></div>
                    <div className="loading-text">Loading orders...</div>
                </div>
            ) : orders.length === 0 ? (
                <div className="empty-state">
                    <div className="empty-state-icon">📭</div>
                    <h3>No orders yet</h3>
                    <p>You haven't entered any orders yet. Start by creating your first order!</p>
                </div>
            ) : (
                <div className="order-list">
                    {orders.map(order => (
                        <div className="card order-card" key={order.id}>
                            <div className="flex-between">
                                <h3>{order.customer_name}</h3>
                                <StatusBadge type="order" value={order.order_status} />
                            </div>
                            <div className="order-details">
                                <span>📞 {order.phone_number}</span>
                                <span>📦 {order.quantity}x {order.box_size}</span>
                                <span>📅 {Array.isArray(order.delivery_slots) && order.delivery_slots.length > 0 ? order.delivery_slots.join(', ') : 'None'}</span>
                            </div>
                            {order.flavour_notes && (
                                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                                    💬 {order.flavour_notes}
                                </div>
                            )}
                            <div className="order-list-badges">
                                <StatusBadge type="payment" value={order.payment_status} />
                                <StatusBadge type="order" value={order.order_status} />
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
