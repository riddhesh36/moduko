import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useOrders } from '../hooks/useOrders'
import { useToast } from '../components/Toast'
import OrderForm from '../components/OrderForm'

export default function OrderFormPage() {
    const { user } = useAuth()
    const { createOrder } = useOrders()
    const { addToast } = useToast()
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)

    async function handleSubmit(orderData) {
        try {
            setLoading(true)

            // Add a timeout to prevent infinite hanging
            const timeoutPromise = new Promise((_, reject) =>
                setTimeout(() => reject(new Error('Request timed out. Please try again.')), 10000)
            )

            await Promise.race([
                createOrder({
                    ...orderData,
                    created_by: user.id
                }),
                timeoutPromise
            ])

            addToast('Order saved successfully!', 'success')
            // Small delay so user sees the toast
            setTimeout(() => navigate('/accountant'), 800)
        } catch (err) {
            addToast(err.message || 'Failed to save order', 'error')
            throw err
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="page-container" style={{ maxWidth: '700px' }}>
            <div className="page-header">
                <h1><img src="/modak.png" alt="Modak" className="modak-icon" /> Add New Order</h1>
                <p>Fill in the customer's order details below</p>
            </div>
            <OrderForm onSubmit={handleSubmit} loading={loading} />
        </div>
    )
}
