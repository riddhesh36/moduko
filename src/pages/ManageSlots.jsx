import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useSlots } from '../hooks/useSlots'
import { useToast } from '../components/Toast'

export default function ManageSlots() {
    const { user } = useAuth()
    const { slots, loading, error, createSlot, toggleSlotActive, deleteSlot } = useSlots()
    const { addToast } = useToast()
    const [newSlot, setNewSlot] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)

    async function handleAddSlot(e) {
        e.preventDefault()
        if (!newSlot.trim()) return

        try {
            setIsSubmitting(true)
            await createSlot(newSlot.trim(), user.id)
            setNewSlot('')
            addToast('Slot added effectively!', 'success')
        } catch (err) {
            addToast(err.message || 'Failed to add slot', 'error')
        } finally {
            setIsSubmitting(false)
        }
    }

    async function handleToggle(id, currentStatus) {
        try {
            await toggleSlotActive(id, currentStatus)
        } catch (err) {
            addToast(err.message || 'Failed to update slot status', 'error')
        }
    }

    async function handleDelete(id) {
        if (!window.confirm('Are you sure you want to delete this slot?')) return
        try {
            await deleteSlot(id)
            addToast('Slot deleted', 'success')
        } catch (err) {
            addToast(err.message || 'Failed to delete slot', 'error')
        }
    }

    return (
        <div className="page-container" style={{ maxWidth: '800px' }}>
            <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1>📅 Manage Delivery Slots</h1>
                    <p>Configure the available dates/slots for orders</p>
                </div>
                <Link to="/accountant" className="btn btn-secondary">← Back to Dashboard</Link>
            </div>

            <form className="card" onSubmit={handleAddSlot} style={{ marginBottom: '2rem' }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label" htmlFor="slot_name">Add New Slot (e.g. "1st May")</label>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <input
                            id="slot_name"
                            type="text"
                            className="form-input"
                            value={newSlot}
                            onChange={(e) => setNewSlot(e.target.value)}
                            placeholder="Slot Name"
                            disabled={isSubmitting}
                        />
                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={isSubmitting || !newSlot.trim()}
                        >
                            {isSubmitting ? 'Adding...' : 'Add Slot'}
                        </button>
                    </div>
                </div>
            </form>

            <div className="card">
                <h3 style={{ marginBottom: '1rem' }}>Existing Slots</h3>

                {loading ? (
                    <div className="loading-container">
                        <div className="spinner"></div>
                        <div className="loading-text">Loading slots...</div>
                    </div>
                ) : error ? (
                    <div className="error-message">Error loading slots: {error}</div>
                ) : slots.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                        No slots created yet. Add one above.
                    </div>
                ) : (
                    <div className="slots-list" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {slots.map(slot => (
                            <div key={slot.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', border: '1px solid var(--border-color)', borderRadius: '8px' }}>
                                <div style={{ fontSize: '1.2rem', fontWeight: '500' }}>{slot.name}</div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                                    <label className="toggle" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                                        <input
                                            type="checkbox"
                                            checked={slot.is_active}
                                            onChange={() => handleToggle(slot.id, slot.is_active)}
                                        />
                                        <span className="toggle-track"></span>
                                        <span className="toggle-thumb"></span>
                                        <span style={{ fontSize: '0.875rem' }}>{slot.is_active ? 'Active' : 'Hidden'}</span>
                                    </label>
                                    <button
                                        onClick={() => handleDelete(slot.id)}
                                        className="btn-danger"
                                        style={{ padding: '0.4rem 0.8rem', borderRadius: '4px', border: 'none', background: '#fee2e2', color: '#dc2626', cursor: 'pointer', fontWeight: 600 }}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
