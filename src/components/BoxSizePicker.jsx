const BOX_SIZES = [
    {
        value: 'classic',
        emoji: <img src="/modak.png" alt="Classic" className="modak-icon" />,
        name: 'Classic',
        description: 'Standard modak box, suitable for everyday gifting or small celebrations'
    },
    {
        value: 'delight',
        emoji: '🎁',
        name: 'Delight',
        description: 'Medium premium box, ideal for occasions like birthdays or pooja'
    },
    {
        value: 'celebration',
        emoji: '🎊',
        name: 'Celebration',
        description: 'Large festive box, suited for weddings, festivals, and bulk orders'
    }
]

export default function BoxSizePicker({ value, onChange }) {
    return (
        <div className="box-size-picker">
            {BOX_SIZES.map(box => (
                <label
                    key={box.value}
                    className={`box-size-card ${value === box.value ? 'selected' : ''}`}
                >
                    <input
                        type="radio"
                        name="box_size"
                        value={box.value}
                        checked={value === box.value}
                        onChange={() => onChange(box.value)}
                    />
                    <span className="box-size-emoji">{box.emoji}</span>
                    <span className="box-size-name">{box.name}</span>
                    <span className="box-size-desc">{box.description}</span>
                </label>
            ))}
        </div>
    )
}
