export default function StatusBadge({ type, value }) {
    const className = `badge badge-${value}`

    return (
        <span className={className}>
            {type === 'order' && value === 'pending' && '⏳ '}
            {type === 'order' && value === 'packed' && '📦 '}
            {type === 'order' && value === 'delivered' && '✅ '}
            {type === 'payment' && value === 'paid' && '💚 '}
            {type === 'payment' && value === 'unpaid' && '🔶 '}
            {value}
        </span>
    )
}
