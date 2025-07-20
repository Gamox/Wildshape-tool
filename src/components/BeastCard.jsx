import { useNavigate } from 'react-router-dom'

export default function BeastCard({ beast }) {
    const navigate = useNavigate()

    return (
        <div
            onClick={() => navigate(`/sheet/${encodeURIComponent(beast.name)}`)}
            className="cursor-pointer bg-gray-800 p-4 rounded hover:bg-gray-700 transition"
        >
            <h2 className="text-lg font-bold mb-1">{beast.name}</h2>
            <p className="text-sm text-gray-400">CR {beast.cr ?? '—'}</p>
            <p className="text-xs text-gray-500">{beast.type}</p>
        </div>
    )
}
