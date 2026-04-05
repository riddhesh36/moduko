import { useState } from 'react'
import { useOrders } from '../hooks/useOrders'
import { useToast } from '../components/Toast'
import OrderForm from '../components/OrderForm'
import '../public-form.css'

export default function PublicOrderForm() {
    const { createOrder } = useOrders()
    const { addToast } = useToast()
    const [loading, setLoading] = useState(false)
    const [submitted, setSubmitted] = useState(false)

    async function handleSubmit(orderData) {
        try {
            setLoading(true)

            // Submit order without user id
            await createOrder({
                ...orderData,
                payment_status: 'unpaid' // Force unpaid for public form
            })

            addToast('Order submitted successfully!', 'success')
            setSubmitted(true)
        } catch (err) {
            addToast(err.message || 'Failed to submit order. Please try again.', 'error')
            throw err
        } finally {
            setLoading(false)
        }
    }

    if (submitted) {
        return (
            <div className="public-page-wrapper">
                <div className="public-success-card" style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '5rem', marginBottom: '1.5rem', animation: 'bounce 2s infinite' }}>🎉</div>
                    <h1 style={{ marginBottom: '1rem', color: 'var(--text-main)', fontSize: '2.5rem' }}>Order Received!</h1>
                    <p style={{ fontSize: '1.15rem', color: 'var(--text-muted)', marginBottom: '2.5rem', lineHeight: '1.6' }}>
                        Thank you for choosing us for your special moments. <br />
                        We will prepare your homemade modaks with love and contact you soon!
                    </p>
                    <button
                        onClick={() => setSubmitted(false)}
                        className="btn btn-primary"
                    >
                        Place Another Order
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="public-page-wrapper">
            <div className="public-header">
                <h1><img src="/modak.png" alt="Modak" /> Modak Co.</h1>
                <p>Order fresh, beautifully crafted homemade modaks for your festive occasions. Simply select your box size and preferred delivery dates below.</p>
            </div>

            <div className="public-form-container">
                <OrderForm onSubmit={handleSubmit} loading={loading} isPublic={true} />
            </div>
        </div>
    )
}
