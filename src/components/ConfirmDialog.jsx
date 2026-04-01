export default function ConfirmDialog({ title, message, onConfirm, onCancel, danger = false }) {
    return (
        <div className="modal-overlay" onClick={onCancel}>
            <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: '400px' }}>
                <div className="confirm-dialog">
                    <div className="confirm-dialog-icon">
                        {danger ? '⚠️' : '❓'}
                    </div>
                    <h3>{title}</h3>
                    <p>{message}</p>
                    <div className="confirm-dialog-actions">
                        <button className="btn btn-ghost" onClick={onCancel}>
                            Cancel
                        </button>
                        <button
                            className={`btn ${danger ? 'btn-danger' : 'btn-primary'}`}
                            onClick={onConfirm}
                            style={danger ? { background: 'var(--danger)', color: 'white', border: 'none' } : {}}
                        >
                            {danger ? 'Delete' : 'Confirm'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
