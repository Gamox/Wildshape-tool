import { useEffect, useRef } from 'react'

export default function RollLog({ rolls, onClose }) {
    const containerRef = useRef()

    useEffect(() => {
        containerRef.current?.scrollTo(0, containerRef.current.scrollHeight)
    }, [rolls])

    console.log(rolls)
    return (
        <div className="fixed bottom-20 right-4 w-64 max-h-80 bg-gray-800 text-white text-sm rounded shadow-lg border border-gray-600 z-50 flex flex-col overflow-hidden">
            <div className="flex justify-between items-center p-2 bg-gray-700 border-b border-gray-600">
                <span className="font-semibold">🎲 Roll Log</span>
                <button
                    onClick={onClose}
                    className="text-gray-300 hover:text-white text-xs"
                >
                    ✖
                </button>
            </div>
            <div
                ref={containerRef}
                className="overflow-y-auto px-3 py-2 space-y-1 text-xs"
            >
                {rolls.length === 0 ? (
                    <div className="text-gray-400 italic">No rolls yet.</div>
                ) : (
                    rolls.map((entry, index) => (
                        <div key={index} className="text-white">
                            <span className="text-gray-400">+{entry.modifier} → </span>
                            <span className="font-bold">{entry.result}</span>
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}
