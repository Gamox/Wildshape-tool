import { Link } from 'react-router-dom'

export default function Home() {
    return (
        <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center px-4">
            <h1 className="text-4xl font-bold mb-4 text-purple-400">
                Welcome to Wildshape Tool
            </h1>
            <p className="text-gray-300 mb-8 text-center max-w-md">
                Track your wildshape options, save shapeshifted beasts, and apply your druid stats.
            </p>

            <div className="flex flex-col gap-4 w-full max-w-sm">
                <Link
                    to="/beasts"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded text-center"
                >
                    View Beast List
                </Link>

                <Link
                    to="/collection"
                    className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded text-center"
                >
                    View Your Collection
                </Link>

                <Link
                    to="/profile"
                    className="w-full bg-yellow-600 hover:bg-yellow-700 text-white py-3 rounded text-center"
                >
                    Edit Druid Profile
                </Link>
            </div>
        </div>
    )
}
