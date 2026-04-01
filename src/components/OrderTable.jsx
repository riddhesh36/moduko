import { useState, useMemo } from 'react'
import StatusBadge from './StatusBadge'

export default function OrderTable({ orders, onMarkPacked, onMarkDelivered, onMarkPaid, onEdit, onDelete }) {
    const [search, setSearch] = useState('')
    const [filterBoxSize, setFilterBoxSize] = useState('')
    const [filterPayment, setFilterPayment] = useState('')
    const [filterStatus, setFilterStatus] = useState('')

    const today = new Date().toISOString().split('T')[0]

    const filteredOrders = useMemo(() => {
        return orders.filter(order => {
            // Search filter
            if (search) {
                const q = search.toLowerCase()
                if (
                    !order.customer_name.toLowerCase().includes(q) &&
                    !order.phone_number.includes(q)
                ) {
                    return false
                }
            }

            // Box size filter
            if (filterBoxSize && order.box_size !== filterBoxSize) return false

            // Payment filter
            if (filterPayment && order.payment_status !== filterPayment) return false

            // Status filter
            if (filterStatus && order.order_status !== filterStatus) return false

            return true
        })
    }, [orders, search, filterBoxSize, filterPayment, filterStatus])

    function getRowClass(order) {
        if (order.delivery_date < today && order.order_status !== 'delivered') return 'row-overdue'
        if (order.payment_status === 'unpaid') return 'row-unpaid'
        return ''
    }

    function formatDate(dateStr) {
        return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        })
    }

    const boxEmoji = { classic: <img src="/modak.png" alt="Classic" className="modak-icon" />, delight: '🎁', celebration: '🎊' }

    return (
        <div className="table-container">
            <div className="table-header">
                <div className="table-search">
                    <span className="table-search-icon">🔍</span>
                    <input
                        type="text"
                        placeholder="Search by name or phone..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        id="order-search"
                    />
                </div>
                <div className="table-filters">
                    <select
                        value={filterBoxSize}
                        onChange={e => setFilterBoxSize(e.target.value)}
                        id="filter-box-size"
                    >
                        <option value="">All Sizes</option>
                        <option value="classic">🏵️ Classic</option>
                        <option value="delight">🎁 Delight</option>
                        <option value="celebration">🎊 Celebration</option>
                    </select>
                    <select
                        value={filterPayment}
                        onChange={e => setFilterPayment(e.target.value)}
                        id="filter-payment"
                    >
                        <option value="">All Payments</option>
                        <option value="paid">Paid</option>
                        <option value="unpaid">Unpaid</option>
                    </select>
                    <select
                        value={filterStatus}
                        onChange={e => setFilterStatus(e.target.value)}
                        id="filter-status"
                    >
                        <option value="">All Statuses</option>
                        <option value="pending">Pending</option>
                        <option value="packed">Packed</option>
                        <option value="delivered">Delivered</option>
                    </select>
                </div>
            </div>

            {filteredOrders.length === 0 ? (
                <div className="table-empty">
                    <div className="table-empty-icon">📭</div>
                    <p>No orders found{search || filterBoxSize || filterPayment || filterStatus ? ' matching your filters' : ''}</p>
                </div>
            ) : (
                <div style={{ overflowX: 'auto' }}>
                    <table className="orders-table">
                        <thead>
                            <tr>
                                <th>Customer</th>
                                <th>Phone</th>
                                <th>Box Size</th>
                                <th>Qty</th>
                                <th>Delivery</th>
                                <th>Notes</th>
                                <th>Payment</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredOrders.map(order => (
                                <tr key={order.id} className={getRowClass(order)}>
                                    <td data-label="Customer">
                                        <strong>{order.customer_name}</strong>
                                    </td>
                                    <td data-label="Phone">{order.phone_number}</td>
                                    <td data-label="Box Size">
                                        {boxEmoji[order.box_size]} {order.box_size}
                                    </td>
                                    <td data-label="Qty">{order.quantity}</td>
                                    <td data-label="Delivery">{formatDate(order.delivery_date)}</td>
                                    <td data-label="Notes">
                                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                                            {order.flavour_notes || '—'}
                                        </span>
                                    </td>
                                    <td data-label="Payment">
                                        <StatusBadge type="payment" value={order.payment_status} />
                                    </td>
                                    <td data-label="Status">
                                        <StatusBadge type="order" value={order.order_status} />
                                    </td>
                                    <td data-label="Actions">
                                        <div className="table-actions">
                                            {order.order_status === 'pending' && (
                                                <button
                                                    className="btn btn-sm btn-secondary"
                                                    onClick={() => onMarkPacked(order.id)}
                                                    title="Mark as Packed"
                                                >
                                                    📦 Pack
                                                </button>
                                            )}
                                            {order.order_status === 'packed' && (
                                                <button
                                                    className="btn btn-sm btn-success"
                                                    onClick={() => onMarkDelivered(order.id)}
                                                    title="Mark as Delivered"
                                                >
                                                    ✅ Deliver
                                                </button>
                                            )}
                                            {order.payment_status === 'unpaid' && (
                                                <button
                                                    className="btn btn-sm btn-warning"
                                                    onClick={() => onMarkPaid(order.id)}
                                                    title="Mark Payment Received"
                                                >
                                                    💰 Paid
                                                </button>
                                            )}
                                            <button
                                                className="btn btn-sm btn-ghost"
                                                onClick={() => onEdit(order)}
                                                title="Edit Order"
                                            >
                                                ✏️
                                            </button>
                                            <button
                                                className="btn btn-sm btn-ghost"
                                                onClick={() => onDelete(order)}
                                                title="Delete Order"
                                                style={{ color: 'var(--danger)' }}
                                            >
                                                🗑️
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {filteredOrders.length > 0 && (
                <div style={{
                    padding: '0.75rem 1.5rem',
                    borderTop: '1px solid var(--border-light)',
                    fontSize: '0.8rem',
                    color: 'var(--text-muted)',
                    display: 'flex',
                    justifyContent: 'space-between'
                }}>
                    <span>Showing {filteredOrders.length} of {orders.length} orders</span>
                    <span>Sorted by delivery date</span>
                </div>
            )}
        </div>
    )
}
