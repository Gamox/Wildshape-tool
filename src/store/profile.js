import { create } from 'zustand'

export const useProfileStore = create((set, get) => {
    const defaultProfile = {
        int: 10,
        wis: 10,
        cha: 10,
        level: 1,
        proficiencyBonus: 2,
        skillProficiencies: {}, // e.g., { Acrobatics: 1 }
    }

    const loadProfile = () => {
        const saved = localStorage.getItem('profile')
        console.log(saved)
        if (saved) {
            try {
                const parsed = JSON.parse(saved)

                // Fill in defaults if missing
                if (parsed.level === undefined) parsed.level = 1
                if (parsed.proficiencyBonus === undefined) parsed.proficiencyBonus = 2
                if (parsed.skillProficiencies === undefined) parsed.skillProficiencies = {}
                return parsed
            } catch {
                return defaultProfile
            }
        }
        return defaultProfile
    }

    return {
        ...loadProfile(),

        setLevel: (value) => set(() => ({ level: value })),

        setStat: (key, value) => set({ [key]: value }),

        setSkillProficiency: (skill, level) =>
            set(state => ({
                skillProficiencies: {
                    ...state.skillProficiencies,
                    [skill]: level
                }
            })),

        save: () => {
            const state = get()
            localStorage.setItem('profile', JSON.stringify({
                int: state.int,
                wis: state.wis,
                cha: state.cha,
                proficiencyBonus: state.proficiencyBonus,
                skillProficiencies: state.skillProficiencies,
                level: state.level
            }))
        }
    }
})
