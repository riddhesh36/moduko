export default function StatsCards({ orders }) {
    const unpaidOrders = orders.filter(o => o.payment_status === 'unpaid')
    const pendingOrders = orders.filter(o => o.order_status === 'pending')
    const packedOrders = orders.filter(o => o.order_status === 'packed')

    const modakCounts = {
        classic: 5,
        delight: 7,
        celebration: 11
    }
    const totalModaks = orders.reduce((sum, o) => {
        const modaksPerBox = modakCounts[o.box_size] || 0
        return sum + (o.quantity * modaksPerBox)
    }, 0)

    const stats = [
        {
            icon: '📋',
            value: orders.length,
            label: 'Total Orders',
            color: 'var(--primary)'
        },
        {
            icon: '💰',
            value: unpaidOrders.length,
            label: 'Unpaid Orders',
            color: 'var(--warning)'
        },
        {
            icon: '📦',
            value: `${packedOrders.length} / ${pendingOrders.length}`,
            label: 'Packed / Pending',
            color: '#1565C0'
        },
        {
            icon: <img src="/modak.png" alt="Modak" className="modak-icon" style={{ height: '0.9em' }} />,
            value: totalModaks,
            label: 'Modak Count',
            color: 'var(--success)'
        }
    ]

    return (
        <div className="stats-grid">
            {stats.map((stat, idx) => (
                <div key={idx} className="stat-card">
                    <div className="stat-icon">{stat.icon}</div>
                    <div className="stat-value" style={{ color: stat.color }}>
                        {stat.value}
                    </div>
                    <div className="stat-label">{stat.label}</div>
                </div>
            ))}
        </div>
    )
}
