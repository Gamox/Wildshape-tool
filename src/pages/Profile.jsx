import { useProfileStore } from '../store/profile'

const skills = [
    'Acrobatics', 'Animal Handling', 'Arcana', 'Athletics',
    'Deception', 'History', 'Insight', 'Intimidation',
    'Investigation', 'Medicine', 'Nature', 'Perception',
    'Performance', 'Persuasion', 'Religion', 'Sleight of Hand',
    'Stealth', 'Survival',
]

const proficiencyOptions = [
    { label: 'None', value: 0 },
    { label: 'Half', value: 0.5 },
    { label: 'Proficient', value: 1 },
    { label: 'Expertise', value: 2 },
]

export default function Profile() {
    const profile = useProfileStore()
    const level = useProfileStore((state) => state.level)
    const setLevel = useProfileStore((state) => state.setLevel)
    console.log(useProfileStore())
    console.log(level)
    const handleSkillChange = (skill, value) => {
        profile.setSkillProficiency(skill, parseFloat(value))
    }

    return (
        <div className="p-4 max-w-3xl mx-auto text-white">
            <h1 className="text-xl font-bold mb-4">Player Profile</h1>
            <div className="mt-4">
                <label className="block text-sm text-white mb-1">Player Level</label>
                <input
                    type="number"
                    min={1}
                    max={20}
                    value={level}
                    onChange={(e) => setLevel(Number(e.target.value))}
                    className="bg-gray-800 text-white px-3 py-1 rounded-md w-24"
                />
            </div>
            <div className="grid grid-cols-3 gap-4 mb-4">
                {['int', 'wis', 'cha'].map(stat => (
                    <div key={stat}>
                        <label className="block font-medium mb-1">{stat.toUpperCase()}</label>
                        <input
                            type="number"
                            value={profile[stat]}
                            onChange={e => profile.setStat(stat, Number(e.target.value))}
                            className="bg-gray-800 border px-2 py-1 rounded w-full"
                        />
                    </div>
                ))}
                <div>
                    <label className="block font-medium mb-1">Proficiency Bonus</label>
                    <input
                        type="number"
                        value={profile.proficiencyBonus}
                        onChange={e => profile.setStat('proficiencyBonus', Number(e.target.value))}
                        className="bg-gray-800 border px-2 py-1 rounded w-full"
                    />
                </div>
            </div>

            <h2 className="text-lg font-semibold mb-2 mt-6">Skill Proficiencies</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {skills.map(skill => (
                    <div key={skill}>
                        <label className="block text-sm mb-1">{skill}</label>
                        <select
                            value={profile.skillProficiencies?.[skill] ?? 0}
                            onChange={e => handleSkillChange(skill, e.target.value)}
                            className="bg-gray-800 border px-2 py-1 rounded w-full text-sm"
                        >
                            {proficiencyOptions.map(option => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>
                ))}
            </div>

            <button
                onClick={() => profile.save()}
                className="mt-6 bg-green-600 hover:bg-green-700 px-4 py-2 rounded text-sm"
            >
                Save Profile
            </button>
        </div>
    )
}
