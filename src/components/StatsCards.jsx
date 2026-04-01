export default function StatsCards({ orders }) {
    const today = new Date().toISOString().split('T')[0]

    const todayOrders = orders.filter(o => o.delivery_date === today)
    const unpaidOrders = orders.filter(o => o.payment_status === 'unpaid')
    const pendingOrders = orders.filter(o => o.order_status === 'pending')
    const packedOrders = orders.filter(o => o.order_status === 'packed')
    const totalBoxesToday = todayOrders.reduce((sum, o) => sum + o.quantity, 0)

    const stats = [
        {
            icon: '📋',
            value: todayOrders.length,
            label: 'Orders Today',
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
            value: totalBoxesToday,
            label: 'Boxes to Prepare Today',
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
