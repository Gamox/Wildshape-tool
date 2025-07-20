import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useRollStore } from '../store/rollStore';

export default function NavBar() {
    const { rolls, clearRolls } = useRollStore();
    const [showRolls, setShowRolls] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowRolls(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <nav className="bg-gray-900 text-white px-6 py-3 flex items-center justify-between border-b border-gray-700">
            <div className="text-purple-300 font-bold text-lg"><Link to="/Wildshape-tool" className="hover:text-purple-400">Wildshape Tool</Link></div>

            <div className="flex items-center space-x-6 relative" ref={dropdownRef}>
                <Link to="/beasts" className="hover:text-purple-400">Compendium</Link>
                <Link to="/collection" className="hover:text-purple-400">Collection</Link>
                <Link to="/profile" className="hover:text-purple-400">Profile</Link>

                <button
                    onClick={() => setShowRolls((prev) => !prev)}
                    className="ml-2 px-3 py-1 rounded bg-purple-600 hover:bg-purple-700 transition"
                >
                    Roll Log
                </button>

                {showRolls && (
                    <div className="absolute right-0 top-full mt-2 w-80 bg-gray-800 border border-gray-700 rounded-xl shadow-xl z-50 animate-fadeIn">
                        <div className="flex justify-between items-center px-4 py-2 border-b border-gray-700">
                            <span className="font-bold text-white text-base flex items-center gap-2">
                                🎲 Roll History
                            </span>
                            <button
                                onClick={clearRolls}
                                className="text-xs text-red-400 hover:text-red-300 border border-red-500 hover:border-red-400 px-2 py-0.5 rounded transition"
                            >
                                Clear
                            </button>
                        </div>

                        <div className="p-2 max-h-64 overflow-y-auto space-y-2">
                            {rolls.length === 0 ? (
                                <div className="text-gray-400 text-sm px-2 py-1">No rolls yet.</div>
                            ) : (
                                rolls.slice().reverse().map((roll) => (
                                    <div
                                        key={roll.id}
                                        className="bg-gray-700/60 text-sm text-gray-200 rounded-md px-3 py-2 font-mono border border-gray-600"
                                    >
                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-400">{roll.timestamp}</span>
                                            <span>
                                                <span className="text-indigo-300 font-semibold">
                                                    {roll.skill}: {roll.natResult} {roll.modifier >= 0 ? '+' : '-'} {Math.abs(roll.modifier)}
                                                </span>{' '}
                                                ={' '}
                                                <span className="text-green-400 font-bold">
                                                    {roll.result}
                                                </span>
                                            </span>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
}
