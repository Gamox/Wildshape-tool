// Sheet.jsx
import { useParams, useNavigate } from 'react-router-dom'
import beasts from '../data/beasts.json'
import { useProfileStore } from '../store/profile'
import { v4 as uuid } from 'uuid'
import Toast from '../components/Toast'
import { useState } from 'react'
import { useRollStore } from '../store/rollStore';

export default function Sheet() {
    const { name } = useParams()
    const navigate = useNavigate()
    const beast = beasts.find((b) => b.name === name)
    const profile = useProfileStore()
    const [toasts, setToasts] = useState([]);
    const addRoll = useRollStore((state) => state.addRoll);
    const level = useProfileStore((state) => state.level)

    if (!beast) return <div className="p-4 text-red-500">Beast not found</div>

    const int = profile.int ?? beast.intelligence ?? 10
    const wis = profile.wis ?? beast.wisdom ?? 10
    const cha = profile.cha ?? beast.charisma ?? 10
    const profBonus = parseInt(profile.proficiencyBonus) || 0

    const getMod = (score) => Math.floor((score - 10) / 2)

    const abilities = [
        { label: 'STR', key: 'strength', value: beast.strength },
        { label: 'DEX', key: 'dexterity', value: beast.dexterity },
        { label: 'CON', key: 'constitution', value: beast.constitution },
        { label: 'INT', key: 'intelligence', value: int },
        { label: 'WIS', key: 'wisdom', value: wis },
        { label: 'CHA', key: 'charisma', value: cha }
    ]

    const savingThrows = abilities.map((stat) => {
        let base = getMod(stat.value)
        if (['intelligence', 'wisdom', 'charisma'].includes(stat.key)) {
            const override = profile[stat.key]
            if (override !== undefined) base = getMod(override)
        }
        const beastSave = beast[`${stat.key}_save`]
        return {
            label: `${stat.label} Save`,
            value: beastSave !== undefined ? beastSave : base
        }
    })

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
        if (key === 'intelligence') return int
        if (key === 'wisdom') return wis
        if (key === 'charisma') return cha
        return beast[key] ?? 10
    }

    const getSkillBonus = (skill) => {
        const statKey = skillStatMap[skill]
        const statMod = getMod(getStatScore(statKey))

        const profLevel = profile.skillProficiencies?.[skill] ?? 0
        let playerProf = 0
        if (profLevel === 0.5) playerProf = Math.floor(profBonus / 2)
        else if (profLevel === 1) playerProf = profBonus
        else if (profLevel === 2) playerProf = profBonus * 2

        const playerTotal = statMod + playerProf
        const skillKey = skill.toLowerCase().replace(/\s+/g, '_')
        const beastBonus = beast[skillKey]

        return beastBonus !== undefined ? Math.max(beastBonus, playerTotal) : playerTotal
    }

    const handleShapeshift = () => {
        const saved = JSON.parse(localStorage.getItem('savedSheets') || '[]')
        const id = uuid()
        saved.push({ id, ...beast })
        localStorage.setItem('savedSheets', JSON.stringify(saved))
        navigate(`/shapeshift/${id}`)
    }

    const renderActionList = (title, actions) => {
        if (!actions?.length) return null;
        return (
            <div className="mb-8">
                <h2 className="text-xl font-semibold text-purple-300 mb-4">{title}</h2>
                <div className="space-y-3">
                    {actions.map((a, i) => (
                        <div key={i} className="bg-gray-800 border border-gray-700 rounded-lg p-4 shadow hover:shadow-lg transition-all duration-200">
                            <div className="text-white font-semibold text-sm mb-1">{a.name}</div>
                            <div className="text-sm text-gray-300">{a.desc}</div>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    return (
        <div className="max-w-5xl mx-auto text-white px-4 py-6">
            {/* Header */}
            <div className="relative bg-gradient-to-r from-indigo-700 to-purple-800 rounded-xl p-6 shadow mb-4">
                <button
                    onClick={handleShapeshift}
                    className="absolute top-4 right-4 bg-indigo-600 hover:bg-indigo-700 text-sm px-4 py-1 rounded shadow"
                >
                    Shapeshift
                </button>

                <h1 className="text-4xl font-bold mb-1">{beast.name}</h1>
                <p className="text-sm text-indigo-200 mb-6">
                    {beast.size} {beast.type}, {beast.alignment || 'Unaligned'}
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-4">
                    {[
                        { label: 'AC', value: beast.armor_class },
                        { label: 'HP', value: beast.hit_points + " (" + beast.hit_dice + ")" },
                        {
                            label: 'Speed', value: (
                                <div className="flex flex-wrap gap-2">
                                    {beast.speed.split(', ').map((s, i) => {
                                        const isFly = s.toLowerCase().includes('fly')
                                        const isSwim = s.toLowerCase().includes('swim')
                                        const locked =
                                            (isFly && level < 8) || (isSwim && level < 4) // ✏️ adjust as needed

                                        return (
                                            <span
                                                key={i}
                                                className={`rounded px-2 py-0.5 ${locked ? 'text-gray-400 line-through cursor-help' : 'text-white'
                                                    }`}
                                                title={
                                                    locked
                                                        ? isFly
                                                            ? 'Flying unlocked at level 8'
                                                            : 'Swimming unlocked at level 4'
                                                        : ''
                                                }
                                            >
                                                {s}
                                            </span>
                                        )
                                    })}
                                </div>
                            )
                        },
                        { label: 'CR', value: beast.challenge_rating },
                        { label: 'Senses', value: beast.senses },
                        { label: 'Languages', value: beast.languages || '—' },
                    ].map((stat, i) => (
                        <div key={i}>
                            <div className="text-sm text-gray-300 mb-1 ml-1">{stat.label}</div>
                            <div className="bg-purple-900/30 rounded-md px-4 py-2 text-white text-sm font-medium shadow-inner">
                                {stat.value}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Abilities */}
            <div className="grid grid-cols-3 md:grid-cols-6 gap-2 text-center mb-4">
                {abilities.map((stat) => (
                    <div key={stat.label} className="bg-gray-800 rounded p-3">
                        <div className="text-xs text-gray-400">{stat.label}</div>
                        <div className="text-lg font-semibold">
                            {stat.value ?? '—'} ({getMod(stat.value) >= 0 ? '+' : ''}
                            {getMod(stat.value)})
                        </div>
                    </div>
                ))}
            </div>

            {/* Saving Throws */}
            <div className="mb-6">
                <h2 className="text-lg font-semibold text-purple-300 mb-2">Saving Throws</h2>
                <div className="grid grid-cols-3 md:grid-cols-6 gap-2 text-center mb-4">
                    {savingThrows.map((s, i) => (
                        <div key={i} className="bg-gray-800 text-center p-2 rounded-lg">
                            <div className="text-gray-400 text-sm">{s.label}</div>
                            <button
                                onClick={() => {
                                    const roll = Math.floor(Math.random() * 20) + 1;
                                    const total = roll + s.value;
                                    const id = Date.now();
                                    setToasts((prev) => [...prev, {
                                        id,
                                        message: `${s.label}: ${roll} ${s.value >= 0 ? '+' : '-'} ${Math.abs(s.value)} = ${total}`,
                                    }]);
                                    setTimeout(() => {
                                        setToasts((prev) => prev.filter((t) => t.id !== id));
                                    }, 3000);
                                    addRoll(s.value, total, s.label, roll);
                                }}
                                className="font-bold bg-indigo-700 hover:bg-indigo-800 px-2 py-1 mt-1 rounded transition"
                            >
                                {s.value >= 0 ? `+${s.value}` : s.value}
                            </button>
                        </div>
                    ))}

                </div>
            </div>

            {/* Skills */}
            <div className="mb-6">
                <h2 className="text-lg font-semibold text-purple-300 mb-2">Skills</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-sm">
                    {Object.entries(skillStatMap).map(([skill]) => {
                        const profLevel = profile.skillProficiencies?.[skill] ?? 0
                        const badge =
                            profLevel === 0 ? 'N' : profLevel === 0.5 ? 'H' : profLevel === 1 ? 'P' : 'E'
                        const badgeColor =
                            profLevel === 0
                                ? 'bg-red-600'
                                : profLevel === 0.5
                                    ? 'bg-yellow-600'
                                    : profLevel === 1
                                        ? 'bg-blue-600'
                                        : 'bg-green-500'
                        const skillKey = skill.toLowerCase().replace(/\s+/g, '_')
                        const beastBonus = beast[skillKey] !== undefined

                        return (
                            <div
                                key={skill}
                                className="flex justify-between items-center px-4 py-2 bg-gray-700 rounded-md hover:bg-gray-600"
                            >
                                <div className="flex items-center gap-2">
                                    <div className="flex items-center gap-1 text-sm font-medium">
                                        {badge && (
                                            <span className={`text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full text-white ${badgeColor}`}>
                                                {badge}
                                            </span>
                                        )}
                                        {beastBonus && (
                                            <span className="text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full bg-purple-600 text-white">
                                                B
                                            </span>
                                        )}
                                        <span>{skill}</span>
                                    </div>
                                </div>
                                <button
                                    onClick={() => {
                                        const modifier = getSkillBonus(skill)
                                        const roll = Math.floor(Math.random() * 20) + 1
                                        const total = roll + modifier
                                        const id = Date.now()
                                        setToasts((prev) => [...prev, { id, message: `${skill}: ${roll} + ${modifier} = ${total}` }])
                                        setTimeout(() => {
                                            setToasts((prev) => prev.filter((t) => t.id !== id))
                                        }, 3000)
                                        addRoll(modifier, roll + modifier, skill, roll)
                                    }}
                                    className="font-bold bg-indigo-700 hover:bg-indigo-800 px-2 py-0.5 rounded text-white text-sm"
                                >
                                    {getSkillBonus(skill) >= 0 ? `+${getSkillBonus(skill)}` : getSkillBonus(skill)}
                                </button>
                            </div>
                        )
                    })}
                </div>
            </div>

            {/* Actions */}
            {renderActionList('Traits', beast.special_abilities)}
            {renderActionList('Actions', beast.actions)}
            {renderActionList('Bonus Actions', [
                ...(beast.bonus_actions || []),
                ...(profile.isMoonDruid ? [{
                    name: 'Combat Wild Shape',
                    desc: 'Use Wild Shape as a bonus action. Spend a spell slot to regain 1d8 HP per level of the slot.'
                }] : [])
            ])}
            {renderActionList('Reactions', beast.reactions)}
            {renderActionList('Legendary Actions', beast.legendary_actions)}
            <div className="fixed bottom-4 right-4 flex flex-col items-end space-y-2">
                {toasts.map((toast) => (
                    <Toast
                        key={toast.id}
                        message={toast.message}
                        onClose={() =>
                            setToasts((prev) => prev.filter((t) => t.id !== toast.id))
                        }
                    />
                ))}
            </div>


        </div>
    )
}
