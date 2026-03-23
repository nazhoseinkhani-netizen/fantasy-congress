import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { Politician } from '@/types/politician'
import type { Team } from '@/types/demo'
import {
  type DraftPhase,
  type DraftTeam,
  type DraftPick,
  type AIArchetype,
  DRAFT_CONFIG,
} from '@/types/draft'
import { snakeDraftTeamIndex } from '@/lib/draft/snake-order'

interface DraftState {
  phase: DraftPhase           // 'lobby' | 'countdown' | 'drafting' | 'user-turn' | 'complete'
  teams: DraftTeam[]          // 4 teams (1 human + 3 AI)
  picks: DraftPick[]          // All picks made so far
  availablePool: string[]     // bioguideIds not yet drafted
  currentPickIndex: number    // 0 to TOTAL_PICKS-1
  userTeamIndex: number       // Which of the 4 teams is the user (randomized 0-3)
  userPickTimer: number       // Seconds remaining for user pick (60 -> 0)
  isAITurnPending: boolean    // Prevents duplicate setTimeout scheduling
  draftSessionId: string      // Random string to detect stale sessions
}

interface DraftActions {
  initDraft: (politicians: Politician[], leagueTeams: Team[]) => void
  startCountdown: () => void
  startDrafting: () => void
  recordPick: (bioguideId: string, salaryCap: number) => void
  setUserPickTimer: (seconds: number) => void
  setAITurnPending: (pending: boolean) => void
  resetDraft: () => void
  getCurrentTeamIndex: () => number
  isUserTurn: () => boolean
}

const AI_ARCHETYPES: AIArchetype[] = ['value-hunter', 'corruption-chaser', 'party-loyalist', 'balanced']

const initialState: DraftState = {
  phase: 'lobby',
  teams: [],
  picks: [],
  availablePool: [],
  currentPickIndex: 0,
  userTeamIndex: 0,
  userPickTimer: DRAFT_CONFIG.USER_PICK_TIMER_SECONDS,
  isAITurnPending: false,
  draftSessionId: '',
}

export const useDraftStore = create<DraftState & DraftActions>()(
  persist(
    (set, get) => ({
      ...initialState,

      initDraft: (politicians: Politician[], leagueTeams: Team[]) => {
        // Generate random userTeamIndex (0-3)
        const userTeamIndex = Math.floor(Math.random() * DRAFT_CONFIG.TEAM_COUNT)

        // Assign AI archetypes round-robin to non-user slots
        let archetypeIdx = 0
        const teams: DraftTeam[] = []

        for (let i = 0; i < DRAFT_CONFIG.TEAM_COUNT; i++) {
          const isUser = i === userTeamIndex
          const leagueTeam = leagueTeams[i] ?? leagueTeams[0]

          if (isUser) {
            teams.push({
              index: i,
              name: leagueTeam.name,
              owner: leagueTeam.owner,
              archetype: 'human',
              roster: [],
              salaryUsed: 0,
              isUser: true,
            })
          } else {
            const archetype = AI_ARCHETYPES[archetypeIdx % AI_ARCHETYPES.length]
            archetypeIdx++
            const aiTeam = leagueTeams[i] ?? leagueTeams[archetypeIdx % leagueTeams.length]
            teams.push({
              index: i,
              name: aiTeam.name,
              owner: aiTeam.owner,
              archetype,
              roster: [],
              salaryUsed: 0,
              isUser: false,
            })
          }
        }

        set({
          phase: 'lobby',
          teams,
          picks: [],
          availablePool: politicians.map((p) => p.bioguideId),
          currentPickIndex: 0,
          userTeamIndex,
          userPickTimer: DRAFT_CONFIG.USER_PICK_TIMER_SECONDS,
          isAITurnPending: false,
          draftSessionId: Date.now().toString(36),
        })
      },

      startCountdown: () => {
        set({ phase: 'countdown' })
      },

      startDrafting: () => {
        const state = get()
        // Determine if first pick is user or AI
        const firstTeam = snakeDraftTeamIndex(0, DRAFT_CONFIG.TEAM_COUNT)
        if (firstTeam === state.userTeamIndex) {
          set({ phase: 'user-turn', userPickTimer: DRAFT_CONFIG.USER_PICK_TIMER_SECONDS })
        } else {
          set({ phase: 'drafting', isAITurnPending: false })
        }
      },

      recordPick: (bioguideId: string, salaryCap: number) => {
        set((state) => {
          const pickNumber = state.currentPickIndex
          const round = Math.floor(pickNumber / DRAFT_CONFIG.TEAM_COUNT)
          const teamIndex = snakeDraftTeamIndex(pickNumber, DRAFT_CONFIG.TEAM_COUNT)

          // Create the pick record
          const pick: DraftPick = {
            pickNumber,
            round,
            teamIndex,
            bioguideId,
            salaryCap,
            timestamp: Date.now(),
          }

          // Update the team that made this pick
          const teams = state.teams.map((team) => {
            if (team.index !== teamIndex) return team
            return {
              ...team,
              roster: [...team.roster, bioguideId],
              salaryUsed: team.salaryUsed + salaryCap,
            }
          })

          // Remove from available pool
          const availablePool = state.availablePool.filter((id) => id !== bioguideId)

          const newPickIndex = pickNumber + 1

          // Check if draft is complete
          if (newPickIndex >= DRAFT_CONFIG.TOTAL_PICKS) {
            return {
              picks: [...state.picks, pick],
              teams,
              availablePool,
              currentPickIndex: newPickIndex,
              phase: 'complete' as DraftPhase,
            }
          }

          // Determine next phase
          const nextTeamIndex = snakeDraftTeamIndex(newPickIndex, DRAFT_CONFIG.TEAM_COUNT)
          const isNextUser = nextTeamIndex === state.userTeamIndex

          const nextPhase: DraftPhase = isNextUser ? 'user-turn' : 'drafting'
          const nextTimer = isNextUser ? DRAFT_CONFIG.USER_PICK_TIMER_SECONDS : state.userPickTimer

          return {
            picks: [...state.picks, pick],
            teams,
            availablePool,
            currentPickIndex: newPickIndex,
            phase: nextPhase,
            userPickTimer: nextTimer,
            isAITurnPending: isNextUser ? state.isAITurnPending : false,
          }
        })
      },

      setUserPickTimer: (seconds: number) => {
        set({ userPickTimer: seconds })
      },

      setAITurnPending: (pending: boolean) => {
        set({ isAITurnPending: pending })
      },

      resetDraft: () => {
        set({
          ...initialState,
          draftSessionId: '',
        })
      },

      getCurrentTeamIndex: () => {
        return snakeDraftTeamIndex(get().currentPickIndex, DRAFT_CONFIG.TEAM_COUNT)
      },

      isUserTurn: () => {
        const state = get()
        const currentTeam = snakeDraftTeamIndex(state.currentPickIndex, DRAFT_CONFIG.TEAM_COUNT)
        return currentTeam === state.userTeamIndex
      },
    }),
    {
      name: 'fantasy-congress-draft',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        phase: state.phase,
        teams: state.teams,
        picks: state.picks,
        availablePool: state.availablePool,
        currentPickIndex: state.currentPickIndex,
        userTeamIndex: state.userTeamIndex,
        draftSessionId: state.draftSessionId,
      }),
    }
  )
)
