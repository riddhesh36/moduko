import { useState } from 'react'
import { useOrders } from '../hooks/useOrders'
import { useToast } from '../components/Toast'
import StatsCards from '../components/StatsCards'
import OrderTable from '../components/OrderTable'
import EditOrderModal from '../components/EditOrderModal'
import ConfirmDialog from '../components/ConfirmDialog'

export default function AdminDashboard() {
    const { orders, loading, markPacked, markDelivered, markPaid, updateOrder, deleteOrder } = useOrders()
    const { addToast } = useToast()
    const [editingOrder, setEditingOrder] = useState(null)
    const [deletingOrder, setDeletingOrder] = useState(null)
    const [actionLoading, setActionLoading] = useState(false)

    async function handleMarkPacked(id) {
        try {
            await markPacked(id)
            addToast('Order marked as packed 📦', 'success')
        } catch (err) {
            addToast('Failed to update order', 'error')
        }
    }

    async function handleMarkDelivered(id) {
        try {
            await markDelivered(id)
            addToast('Order marked as delivered ✅', 'success')
        } catch (err) {
            addToast('Failed to update order', 'error')
        }
    }

    async function handleMarkPaid(id) {
        try {
            await markPaid(id)
            addToast('Payment received 💰', 'success')
        } catch (err) {
            addToast('Failed to update payment', 'error')
        }
    }

    async function handleSaveEdit(id, updates) {
        try {
            setActionLoading(true)
            await updateOrder(id, updates)
            addToast('Order updated successfully ✏️', 'success')
            setEditingOrder(null)
        } catch (err) {
            addToast('Failed to update order', 'error')
        } finally {
            setActionLoading(false)
        }
    }

    async function handleConfirmDelete() {
        if (!deletingOrder) return
        try {
            setActionLoading(true)
            await deleteOrder(deletingOrder.id)
            addToast('Order deleted 🗑️', 'success')
            setDeletingOrder(null)
        } catch (err) {
            addToast('Failed to delete order', 'error')
        } finally {
            setActionLoading(false)
        }
    }

    const pendingCount = orders.filter(o => o.order_status === 'pending').length

    return (
        <div className="page-container">
            <div className="page-header flex-between">
                <div>
                    <h1>
                        <img src="/modak.png" alt="Modak" className="modak-icon" /> Order Dashboard
                        {pendingCount > 0 && (
                            <span style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                background: 'var(--primary)',
                                color: 'white',
                                borderRadius: '99px',
                                fontSize: '0.75rem',
                                fontWeight: 700,
                                padding: '0.125rem 0.5rem',
                                marginLeft: '0.5rem',
                                verticalAlign: 'middle'
                            }}>
                                {pendingCount} pending
                            </span>
                        )}
                    </h1>
                    <p>Manage all orders, track fulfilment, and reconcile payments</p>
                </div>
            </div>

            {loading ? (
                <div className="loading-container">
                    <div className="spinner"></div>
                    <div className="loading-text">Loading orders...</div>
                </div>
            ) : (
                <>
                    <StatsCards orders={orders} />

                    <OrderTable
                        orders={orders}
                        onMarkPacked={handleMarkPacked}
                        onMarkDelivered={handleMarkDelivered}
                        onMarkPaid={handleMarkPaid}
                        onEdit={setEditingOrder}
                        onDelete={setDeletingOrder}
                    />
                </>
            )}

            {editingOrder && (
                <EditOrderModal
                    order={editingOrder}
                    onSave={handleSaveEdit}
                    onClose={() => setEditingOrder(null)}
                    loading={actionLoading}
                />
            )}

            {deletingOrder && (
                <ConfirmDialog
                    title="Delete Order"
                    message={`Are you sure you want to delete the order for ${deletingOrder.customer_name}? This action cannot be undone.`}
                    danger
                    onConfirm={handleConfirmDelete}
                    onCancel={() => setDeletingOrder(null)}
                />
            )}
        </div>
    )
}
