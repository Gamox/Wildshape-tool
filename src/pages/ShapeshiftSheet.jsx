import { useParams, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { useProfileStore } from '../store/profile'

export default function ShapeshiftSheet() {
    const { id } = useParams()
    const navigate = useNavigate()
    const profile = useProfileStore()

    const [sheet, setSheet] = useState(null)
    const [editMode, setEditMode] = useState(false)
    const [customName, setCustomName] = useState('')

    useEffect(() => {
        const saved = JSON.parse(localStorage.getItem('savedSheets') || '[]')
        const found = saved.find((s) => s.id === id)
        if (found) {
            setSheet(found)
            setCustomName(found.name || '')
        }
    }, [id])

    const getMod = (score) => Math.floor((score - 10) / 2)

    const skillStatMap = {
        Acrobatics: 'dexterity',
        'Animal Handling': 'wisdom',
        Arcana: 'intelligence',
        Athletics: 'strength',
        Deception: 'charisma',
        History: 'intelligence',
        Insight: 'wisdom',
        Intimidation: 'charisma',
        Investigation: 'intelligence',
        Medicine: 'wisdom',
        Nature: 'intelligence',
        Perception: 'wisdom',
        Performance: 'charisma',
        Persuasion: 'charisma',
        Religion: 'intelligence',
        'Sleight of Hand': 'dexterity',
        Stealth: 'dexterity',
        Survival: 'wisdom'
    }

    const getStatScore = (key) => {
        if (!sheet) return 10
        if (key === 'intelligence') return profile.int ?? sheet.intelligence ?? 10
        if (key === 'wisdom') return profile.wis ?? sheet.wisdom ?? 10
        if (key === 'charisma') return profile.cha ?? sheet.charisma ?? 10
        return sheet[key] ?? 10
    }

    const getSkillBonus = (skill) => {
        const statKey = skillStatMap[skill]
        const statScore = getStatScore(statKey)
        const statMod = getMod(statScore)
        const profBonus = parseInt(profile.proficiencyBonus) || 0

        const profLevel = profile.skillProficiencies?.[skill] ?? 0
        let playerProf = 0
        if (profLevel === 0.5) playerProf = Math.floor(profBonus / 2)
        else if (profLevel === 1) playerProf = profBonus
        else if (profLevel === 2) playerProf = profBonus * 2

        const totalPlayerBonus = statMod + playerProf
        const beastBonus = sheet.skills?.[skill] ?? null

        return beastBonus !== null ? Math.max(beastBonus, totalPlayerBonus) : totalPlayerBonus
    }

    const handleSave = () => {
        const saved = JSON.parse(localStorage.getItem('savedSheets') || '[]')
        const updated = saved.map((s) =>
            s.id === id ? { ...s, name: customName } : s
        )
        localStorage.setItem('savedSheets', JSON.stringify(updated))
        setEditMode(false)
    }

    if (!sheet) return <div className="p-4 text-red-500">Shapeshifted sheet not found</div>

    const abilities = [
        { label: 'STR', value: sheet.strength },
        { label: 'DEX', value: sheet.dexterity },
        { label: 'CON', value: sheet.constitution },
        { label: 'INT', value: profile.int ?? sheet.intelligence },
        { label: 'WIS', value: profile.wis ?? sheet.wisdom },
        { label: 'CHA', value: profile.cha ?? sheet.charisma }
    ]

    return (
        <div className="max-w-4xl mx-auto text-white font-sans">
            {/* Header */}
            <div className="relative bg-gradient-to-r from-purple-700 to-indigo-700 rounded-t-xl p-6 shadow">
                <div className="flex justify-between items-center">
                    {editMode ? (
                        <input
                            value={customName}
                            onChange={(e) => setCustomName(e.target.value)}
                            className="text-3xl font-bold bg-transparent border-b border-white focus:outline-none text-white"
                        />
                    ) : (
                        <h1 className="text-3xl font-bold text-white">{customName}</h1>
                    )}
                    <div className="ml-4">
                        {editMode ? (
                            <button
                                onClick={handleSave}
                                className="bg-green-600 hover:bg-green-700 text-white font-semibold py-1 px-3 rounded"
                            >
                                Save
                            </button>
                        ) : (
                            <button
                                onClick={() => setEditMode(true)}
                                className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-1 px-3 rounded"
                            >
                                Edit
                            </button>
                        )}
                    </div>
                </div>

                {/* Info Grid */}
                <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 text-sm">
                    <InfoBox label="AC" value={sheet.armor_class} />
                    <InfoBox label="Speed" value={sheet.speed} />
                    <InfoBox label="HP" value={sheet.hit_points} />
                    <InfoBox label="Size" value={`${sheet.size} ${sheet.type}`} />
                    <InfoBox label="Alignment" value={sheet.alignment} />
                    <InfoBox label="Languages" value={sheet.languages || '—'} />
                </div>
            </div>

            {/* Abilities */}
            <div className="grid grid-cols-3 md:grid-cols-6 text-center bg-gray-900 text-white py-4 px-2 border-t border-gray-800">
                {abilities.map((a) => (
                    <div key={a.label}>
                        <div className="text-xs text-gray-400">{a.label}</div>
                        <div className="text-xl font-semibold">
                            {a.value ?? '—'}
                            <span className="text-sm text-gray-400 ml-1">
                                ({a.value != null ? (getMod(a.value) >= 0 ? `+${getMod(a.value)}` : getMod(a.value)) : '—'})
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Skills */}
            <div className="bg-gray-800 px-6 py-5 text-white border-t border-gray-700">
                <h2 className="text-xl font-semibold text-purple-300 mb-4">Skills</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-sm font-mono">
                    {Object.entries(skillStatMap).map(([skill]) => {
                        const profLevel = profile.skillProficiencies?.[skill] ?? 0
                        const badge = profLevel === 0 ? 'N' : profLevel === 0.5 ? 'H' : profLevel === 1 ? 'P' : profLevel === 2 ? 'E' : null
                        const badgeColor =
                            profLevel === 0 ? 'bg-red-600' :
                                profLevel === 0.5 ? 'bg-yellow-600' :
                                    profLevel === 1 ? 'bg-blue-600' :
                                        profLevel === 2 ? 'bg-green-500' : ''

                        return (
                            <div key={skill} className="flex justify-between items-center px-4 py-2 bg-gray-700 rounded-md hover:bg-gray-600">
                                <div className="flex flex-col">
                                    <span className="font-semibold">{badge && <span className={`text-xs mt-1 px-2 py-0.5 rounded-full ${badgeColor}`}>{badge}</span>} {skill}</span>

                                </div>
                                <span className="font-bold border-l border-gray-500 pl-3">
                                    {getSkillBonus(skill) >= 0 ? `+${getSkillBonus(skill)}` : getSkillBonus(skill)}
                                </span>
                            </div>
                        )
                    })}
                </div>
            </div>

            {/* Actions */}
            {sheet.actions?.length > 0 && (
                <div className="mt-4 px-6">
                    <h2 className="text-xl font-semibold text-purple-300 mb-2">Actions</h2>
                    <ul className="list-disc pl-6 space-y-2 text-sm text-gray-300">
                        {sheet.actions.map((a, i) => (
                            <li key={i}>
                                <span className="font-semibold text-white">{a.name}:</span> {a.desc}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    )
}

function InfoBox({ label, value }) {
    return (
        <div className="bg-white/10 rounded p-2">
            <div className="text-purple-300 text-xs font-medium uppercase">{label}</div>
            <div>{value}</div>
        </div>
    )
}
