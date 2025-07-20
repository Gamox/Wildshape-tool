export default function StatBlock({ beast }) {
    const stats = ['str', 'dex', 'con', 'int', 'wis', 'cha']

    const modifier = (score) => {
        const mod = Math.floor((score - 10) / 2)
        return (mod >= 0 ? '+' : '') + mod
    }

    return (
        <div className="grid grid-cols-3 gap-4 bg-gray-800 p-4 rounded mb-4">
            {stats.map(stat => (
                <div key={stat}>
                    <div className="font-bold text-sm">{stat.toUpperCase()}</div>
                    <div className="text-xl">{beast[stat]}</div>
                    <div className="text-sm text-gray-400">{modifier(beast[stat])}</div>
                </div>
            ))}
        </div>
    )
}
