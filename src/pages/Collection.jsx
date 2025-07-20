import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Collection() {
    const [savedSheets, setSavedSheets] = useState([])
    const navigate = useNavigate()

    useEffect(() => {
        loadSheets()
    }, [])

    const loadSheets = () => {
        const saved = localStorage.getItem('savedSheets')
        setSavedSheets(saved ? JSON.parse(saved) : [])
    }

    const viewSheet = (id) => {
        navigate(`/shapeshift/${id}`)
    }

    const deleteSheet = (idToDelete) => {
        const updated = savedSheets.filter(sheet => sheet.id !== idToDelete)
        localStorage.setItem('savedSheets', JSON.stringify(updated))
        setSavedSheets(updated)
    }

    return (
        <div className="max-w-4xl mx-auto p-4 text-white">
            <h1 className="text-2xl font-bold mb-4">Your Shapeshifted Beasts</h1>
            {savedSheets.length === 0 ? (
                <p className="text-gray-400">No saved shapeshifts.</p>
            ) : (
                <ul className="space-y-2">
                    {savedSheets.map((sheet) => (
                        <li
                            key={sheet.id}
                            className="bg-gray-800 p-3 rounded flex justify-between items-center"
                        >
                            <div>
                                <div className="font-semibold">{sheet.name}</div>
                                <div className="text-sm text-gray-400">
                                    CR {sheet.cr || '—'} | AC {sheet.ac || '—'}
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => viewSheet(sheet.id)}
                                    className="bg-blue-600 hover:bg-blue-700 px-2 py-1 rounded text-xs"
                                >
                                    View
                                </button>
                                <button
                                    onClick={() => deleteSheet(sheet.id)}
                                    className="bg-red-600 hover:bg-red-700 px-2 py-1 rounded text-xs"
                                >
                                    Delete
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}
