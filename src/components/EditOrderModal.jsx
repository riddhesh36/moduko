import { useState } from 'react'
import BoxSizePicker from './BoxSizePicker'
import { useSlots } from '../hooks/useSlots'

export default function EditOrderModal({ order, onSave, onClose, loading }) {
    const [form, setForm] = useState({
        customer_name: order.customer_name,
        phone_number: order.phone_number,
        box_size: order.box_size,
        quantity: order.quantity,
        delivery_slots: Array.isArray(order.delivery_slots) ? order.delivery_slots : [],
        flavour_notes: order.flavour_notes || '',
        payment_status: order.payment_status,
        order_status: order.order_status
    })
    const [errors, setErrors] = useState({})
    const { activeSlots, loading: slotsLoading } = useSlots()

    function handleChange(e) {
        const { name, value } = e.target
        setForm(prev => ({ ...prev, [name]: value }))
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }))
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
        if (!form.customer_name.trim()) newErrors.customer_name = 'Required'
        if (!form.phone_number.trim()) {
            newErrors.phone_number = 'Required'
        } else if (!/^\d{10}$/.test(form.phone_number.trim())) {
            newErrors.phone_number = 'Must be 10 digits'
        }
        if (!form.box_size) newErrors.box_size = 'Required'
        if (!form.quantity || form.quantity < 1) newErrors.quantity = 'Min 1'
        if (form.delivery_slots.length === 0) newErrors.delivery_slots = 'Required'
        if (form.flavour_notes && form.flavour_notes.length > 300) {
            newErrors.flavour_notes = 'Max 300 characters'
        }
        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    async function handleSubmit(e) {
        e.preventDefault()
        if (!validate()) return
        await onSave(order.id, {
            customer_name: form.customer_name.trim(),
            phone_number: form.phone_number.trim(),
            box_size: form.box_size,
            quantity: parseInt(form.quantity, 10),
            delivery_slots: form.delivery_slots,
            flavour_notes: form.flavour_notes.trim() || null,
            payment_status: form.payment_status,
            order_status: form.order_status
        })
    }

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>✏️ Edit Order</h2>
                    <button className="btn btn-ghost btn-sm" onClick={onClose}>✕</button>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="modal-body">
                        <div className="form-row">
                            <div className="form-group">
                                <label className="form-label">Customer Name *</label>
                                <input
                                    name="customer_name"
                                    type="text"
                                    className="form-input"
                                    value={form.customer_name}
                                    onChange={handleChange}
                                />
                                {errors.customer_name && <div className="form-error">⚠ {errors.customer_name}</div>}
                            </div>
                            <div className="form-group">
                                <label className="form-label">Phone *</label>
                                <input
                                    name="phone_number"
                                    type="tel"
                                    className="form-input"
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
                                onChange={v => {
                                    setForm(prev => ({ ...prev, box_size: v }))
                                    if (errors.box_size) setErrors(prev => ({ ...prev, box_size: '' }))
                                }}
                            />
                            {errors.box_size && <div className="form-error">⚠ {errors.box_size}</div>}
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label className="form-label">Quantity *</label>
                                <input
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
                                <label className="form-label">Delivery Dates *</label>
                                {slotsLoading ? (
                                    <div style={{ padding: '0.5rem', color: 'var(--text-muted)' }}>Loading slots...</div>
                                ) : activeSlots.length > 0 ? (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.5rem' }}>
                                        {activeSlots.map(slot => (
                                            <label key={slot.id} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                                                <input
                                                    type="checkbox"
                                                    checked={form.delivery_slots.includes(slot.name)}
                                                    onChange={() => handleSlotToggle(slot.name)}
                                                    style={{ width: '1.2rem', height: '1.2rem' }}
                                                />
                                                <span>{slot.name}</span>
                                            </label>
                                        ))}
                                    </div>
                                ) : (
                                    <div style={{ padding: '0.5rem', color: 'var(--error)' }}>
                                        No active dates available.
                                    </div>
                                )}
                                {errors.delivery_slots && <div className="form-error">⚠ {errors.delivery_slots}</div>}
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Flavour Notes</label>
                            <textarea
                                name="flavour_notes"
                                className="form-textarea"
                                value={form.flavour_notes}
                                onChange={handleChange}
                                maxLength={300}
                            />
                            <div className="form-hint">{form.flavour_notes.length}/300</div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label className="form-label">Payment Status</label>
                                <select
                                    name="payment_status"
                                    className="form-select"
                                    value={form.payment_status}
                                    onChange={handleChange}
                                >
                                    <option value="unpaid">🔶 Unpaid</option>
                                    <option value="paid">💚 Paid</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Order Status</label>
                                <select
                                    name="order_status"
                                    className="form-select"
                                    value={form.order_status}
                                    onChange={handleChange}
                                >
                                    <option value="pending">⏳ Pending</option>
                                    <option value="packed">📦 Packed</option>
                                    <option value="delivered">✅ Delivered</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button>
                        <button type="submit" className="btn btn-primary" disabled={loading || activeSlots.length === 0}>
                            {loading ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
