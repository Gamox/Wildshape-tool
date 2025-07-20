import { useEffect, useState } from 'react'

export default function Toast({ message, onClose }) {
    const [visible, setVisible] = useState(false)

    useEffect(() => {
        setVisible(true)
        const fadeOutTimeout = setTimeout(() => setVisible(false), 3000)
        const removeTimeout = setTimeout(() => onClose(), 4000)
        return () => {
            clearTimeout(fadeOutTimeout)
            clearTimeout(removeTimeout)
        }
    }, [onClose])

    return (
        <div
            className={`transition-all duration-1000 ease-in-out transform bg-gray-900 text-white text-sm px-4 py-2 rounded shadow-md mb-2 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                }`}
        >
            🎲 {message}
        </div>
    )
}
