import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

interface GameState {
  selectedWeek: number
  activeLeagueId: string
  rosterOverrides: Record<string, { active: string[]; bench: string[] }>
}

interface GameActions {
  setSelectedWeek: (week: number) => void
  setActiveLeagueId: (id: string) => void
  swapRosterSlots: (teamId: string, fromId: string, toId: string, originalRoster: { active: string[]; bench: string[] }) => void
  resetRoster: (teamId: string) => void
}

export const useGameStore = create<GameState & GameActions>()(
  persist(
    (set) => ({
      selectedWeek: 6,
      activeLeagueId: '',
      rosterOverrides: {},
      setSelectedWeek: (week) => set({ selectedWeek: week }),
      setActiveLeagueId: (id) => set({ activeLeagueId: id }),
      swapRosterSlots: (teamId, fromId, toId, originalRoster) =>
        set((state) => {
          const current = state.rosterOverrides[teamId] ?? { active: [...originalRoster.active], bench: [...originalRoster.bench] }
          const active = [...current.active]
          const bench = [...current.bench]
          const fromActive = active.indexOf(fromId)
          const fromBench = bench.indexOf(fromId)
          const toActive = active.indexOf(toId)
          const toBench = bench.indexOf(toId)
          if (fromActive >= 0 && toBench >= 0) {
            active[fromActive] = toId
            bench[toBench] = fromId
          } else if (fromBench >= 0 && toActive >= 0) {
            bench[fromBench] = toId
            active[toActive] = fromId
          } else if (fromActive >= 0 && toActive >= 0) {
            active[fromActive] = toId
            active[toActive] = fromId
          }
          return { rosterOverrides: { ...state.rosterOverrides, [teamId]: { active, bench } } }
        }),
      resetRoster: (teamId) =>
        set((state) => {
          const { [teamId]: _, ...rest } = state.rosterOverrides
          return { rosterOverrides: rest }
        }),
    }),
    {
      name: 'fantasy-congress-game',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        selectedWeek: state.selectedWeek,
        rosterOverrides: state.rosterOverrides,
      }),
    }
  )
)
