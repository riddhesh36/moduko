import { useState } from 'react'
import BoxSizePicker from './BoxSizePicker'
import { useSlots } from '../hooks/useSlots'

const initialForm = {
    customer_name: '',
    phone_number: '',
    box_size: '',
    quantity: 1,
    delivery_slots: [],
    flavour_notes: '',
    payment_status: 'unpaid'
}

export default function OrderForm({ onSubmit, loading, isPublic = false }) {
    const [form, setForm] = useState(initialForm)
    const [errors, setErrors] = useState({})
    const { activeSlots, loading: slotsLoading } = useSlots()

    function handleChange(e) {
        const { name, value } = e.target
        setForm(prev => ({ ...prev, [name]: value }))
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }))
        }
    }

    function handleBoxSizeChange(value) {
        setForm(prev => ({ ...prev, box_size: value }))
        if (errors.box_size) {
            setErrors(prev => ({ ...prev, box_size: '' }))
        }
    }

    function handlePaymentToggle() {
        setForm(prev => ({
            ...prev,
            payment_status: prev.payment_status === 'paid' ? 'unpaid' : 'paid'
        }))
    }

    function handleSlotToggle(slotName) {
        setForm(prev => {
            const isSelected = prev.delivery_slots.includes(slotName)
            let newSlots
            if (isSelected) {
                newSlots = prev.delivery_slots.filter(s => s !== slotName)
            } else {
                newSlots = [...prev.delivery_slots, slotName]
            }
            if (errors.delivery_slots) {
                setErrors(prevErrors => ({ ...prevErrors, delivery_slots: '' }))
            }
            return { ...prev, delivery_slots: newSlots }
        })
    }

    function validate() {
        const newErrors = {}

        if (!form.customer_name.trim()) {
            newErrors.customer_name = 'Customer name is required'
        }

        if (!form.phone_number.trim()) {
            newErrors.phone_number = 'Phone number is required'
        } else if (!/^\d{10}$/.test(form.phone_number.trim())) {
            newErrors.phone_number = 'Enter a valid 10-digit phone number'
        }

        if (!form.box_size) {
            newErrors.box_size = 'Please select a box size'
        }

        if (!form.quantity || form.quantity < 1) {
            newErrors.quantity = 'Quantity must be at least 1'
        }

        if (form.delivery_slots.length === 0) {
            newErrors.delivery_slots = 'Please select at least one delivery date/slot'
        }

        if (form.flavour_notes && form.flavour_notes.length > 300) {
            newErrors.flavour_notes = 'Notes must be under 300 characters'
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    async function handleSubmit(e) {
        e.preventDefault()
        if (!validate()) return

        try {
            await onSubmit({
                customer_name: form.customer_name.trim(),
                phone_number: form.phone_number.trim(),
                box_size: form.box_size,
                quantity: parseInt(form.quantity, 10),
                delivery_slots: form.delivery_slots,
                flavour_notes: form.flavour_notes.trim() || null,
                payment_status: isPublic ? 'unpaid' : form.payment_status,
                order_status: 'pending'
            })
            setForm(initialForm)
            setErrors({})
        } catch (err) {
            // Error handled by parent
        }
    }

    return (
        <form className="card" onSubmit={handleSubmit} id="order-form">
            {!isPublic && (
                <div style={{ marginBottom: '1.5rem' }}>
                    <h2>📝 New Order</h2>
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                        Fill in the customer order details below
                    </p>
                </div>
            )}

            <div className="form-row">
                <div className="form-group">
                    <label className="form-label" htmlFor="customer_name">Customer Name *</label>
                    <input
                        id="customer_name"
                        name="customer_name"
                        type="text"
                        className="form-input"
                        placeholder="Enter full name"
                        value={form.customer_name}
                        onChange={handleChange}
                    />
                    {errors.customer_name && <div className="form-error">⚠ {errors.customer_name}</div>}
                </div>

                <div className="form-group">
                    <label className="form-label" htmlFor="phone_number">Phone / WhatsApp *</label>
                    <input
                        id="phone_number"
                        name="phone_number"
                        type="tel"
                        className="form-input"
                        placeholder="10-digit number"
                        value={form.phone_number}
                        onChange={handleChange}
                        maxLength={10}
                    />
                    {errors.phone_number && <div className="form-error">⚠ {errors.phone_number}</div>}
                </div>
            </div>

            <div className="form-group">
                <label className="form-label">Box Size *</label>
                <BoxSizePicker
                    value={form.box_size}
                    onChange={handleBoxSizeChange}
                />
                {errors.box_size && <div className="form-error">⚠ {errors.box_size}</div>}
            </div>

            <div className="form-row">
                <div className="form-group">
                    <label className="form-label" htmlFor="quantity">Quantity *</label>
                    <input
                        id="quantity"
                        name="quantity"
                        type="number"
                        className="form-input"
                        min="1"
                        value={form.quantity}
                        onChange={handleChange}
                    />
                    {errors.quantity && <div className="form-error">⚠ {errors.quantity}</div>}
                </div>

                <div className="form-group">
                    <label className="form-label">Delivery Dates (Select dates) *</label>
                    {slotsLoading ? (
                        <div style={{ padding: '0.5rem', color: 'var(--text-muted)' }}>Loading slots...</div>
                    ) : activeSlots.length > 0 ? (
                        <div className="slots-container">
                            {activeSlots.map(slot => {
                                const isSelected = form.delivery_slots.includes(slot.name);
                                return (
                                    <label
                                        key={slot.id}
                                        className={`slot-checkbox-label ${isSelected ? 'selected' : ''}`}
                                    >
                                        <input
                                            type="checkbox"
                                            checked={isSelected}
                                            onChange={() => handleSlotToggle(slot.name)}
                                        />
                                        <span>{slot.name}</span>
                                    </label>
                                )
                            })}
                        </div>
                    ) : (
                        <div style={{ padding: '0.5rem', border: '1px solid var(--error)', borderRadius: '8px', color: 'var(--error)' }}>
                            No active dates available right now. Please check back later!
                        </div>
                    )}
                    {errors.delivery_slots && <div className="form-error">⚠ {errors.delivery_slots}</div>}
                </div>
            </div>

            <div className="form-group">
                <label className="form-label" htmlFor="flavour_notes">Special Requests / Flavour Notes</label>
                <textarea
                    id="flavour_notes"
                    name="flavour_notes"
                    className="form-textarea"
                    placeholder="Any special requests or flavour preferences..."
                    value={form.flavour_notes}
                    onChange={handleChange}
                    maxLength={300}
                />
                <div className="form-hint">{form.flavour_notes.length}/300 characters</div>
                {errors.flavour_notes && <div className="form-error">⚠ {errors.flavour_notes}</div>}
            </div>

            {!isPublic && (
                <div className="form-group">
                    <label className="form-label">Payment Status</label>
                    <div className="toggle-container">
                        <label className="toggle">
                            <input
                                type="checkbox"
                                checked={form.payment_status === 'paid'}
                                onChange={handlePaymentToggle}
                            />
                            <span className="toggle-track"></span>
                            <span className="toggle-thumb"></span>
                        </label>
                        <span className={`toggle-label ${form.payment_status}`}>
                            {form.payment_status === 'paid' ? '💚 Paid' : '🔶 Unpaid'}
                        </span>
                    </div>
                </div>
            )}

            <button
                type="submit"
                className="btn btn-primary btn-lg"
                disabled={loading || activeSlots.length === 0}
                style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
            >
                {loading ? '⏳ Submitting...' : (
                    <>
                        <img src="/modak.png" alt="" className="modak-icon" style={{ filter: 'brightness(0) invert(1)' }} />
                        {isPublic ? 'Place Order' : 'Save Order'}
                    </>
                )}
            </button>
        </form>
    )
}
