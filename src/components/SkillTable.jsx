import { useProfileStore } from '../store/profile'

const skillInfo = [
    { name: 'Acrobatics', stat: 'dex' },
    { name: 'Animal Handling', stat: 'wis' },
    { name: 'Arcana', stat: 'int' },
    { name: 'Athletics', stat: 'str' },
    { name: 'Deception', stat: 'cha' },
    { name: 'History', stat: 'int' },
    { name: 'Insight', stat: 'wis' },
    { name: 'Intimidation', stat: 'cha' },
    { name: 'Investigation', stat: 'int' },
    { name: 'Medicine', stat: 'wis' },
    { name: 'Nature', stat: 'int' },
    { name: 'Perception', stat: 'wis' },
    { name: 'Performance', stat: 'cha' },
    { name: 'Persuasion', stat: 'cha' },
    { name: 'Religion', stat: 'int' },
    { name: 'Sleight of Hand', stat: 'dex' },
    { name: 'Stealth', stat: 'dex' },
    { name: 'Survival', stat: 'wis' },
]

function getMod(score) {
    return Math.floor((score - 10) / 2)
}

export default function SkillTable({ beast }) {
    const profile = useProfileStore()

    return (
        <table className="w-full text-sm mb-4">
            <thead>
                <tr className="text-left text-gray-400 border-b border-gray-600">
                    <th className="py-1">Skill</th>
                    <th className="py-1">Bonus</th>
                </tr>
            </thead>
            <tbody>
                {skillInfo.map(skill => {
                    const statValue = beast[skill.stat]
                    const statMod = getMod(statValue)
                    const beastBonus = beast.skills?.[skill.name] ?? null
                    const profLevel = profile.skillProficiencies?.[skill.name.toLowerCase()] ?? 0
                    const playerBonus = statMod + profLevel * profile.proficiencyBonus

                    let final = statMod
                    if (beastBonus !== null) {
                        const beastModOnly = beastBonus - statMod
                        final += Math.max(beastModOnly, profLevel * profile.proficiencyBonus)
                    } else {
                        final = playerBonus
                    }

                    return (
                        <tr key={skill.name}>
                            <td>{skill.name}</td>
                            <td className="text-right">{final >= 0 ? '+' : ''}{final}</td>
                        </tr>
                    )
                })}
            </tbody>
        </table>
    )
}
