# Project File Structure

> This is the expected file structure for future development reference
> 

```
src/
├── components/                    # Components (each subfolder represents a feature module)
│   ├── common/                    # Common components (Button, Card, Wrapper, ProgressBar, etc.)
│   ├── timer/                     # Timer-related components
│   ├── goals/                     # Goals/habits-related components
│   ├── customization/             # Customization components (themes, backgrounds, music, etc.)
│   └── auth/                      # Authentication components
│
├── screens/                       # Screens/Pages
│   ├── HomeScreen.tsx             # Home/Dashboard
│   ├── TimerScreen.tsx            # Timer page
│   ├── AchievementsScreen.tsx     # Achievements page
│   ├── SettingsScreen.tsx         # Settings page
│   ├── ProfileScreen.tsx          # User profile
│   └── auth/
│       ├── LoginScreen.tsx
│       └── SignUpScreen.tsx
│
├── navigation/                    # Navigation configuration
│   ├── AppNavigator.tsx           # Main navigator
│   ├── AuthNavigator.tsx          # Auth navigator
│   ├── TabNavigator.tsx           # Bottom tab navigator
│   └── types.ts                   # Navigation type definitions
│
├── store/                         # State management (Zustand)
│   ├── useAuthStore.ts            # Auth state
│   ├── useTimerStore.ts           # Timer state
│   ├── useThemeStore.ts           # Theme state
│   └── useSettingsStore.ts        # Settings state
│
├── services/                      # API/Data services
│   ├── goalService.ts
│   └── syncService.ts
│
├── hooks/                         # Custom Hooks (Not yet implemented)
│   ├── useTimer.ts
│   ├── useGoals.ts
│   ├── useSessions.ts
│   ├── useAchievements.ts
│   └── useSpotify.ts
│
├── utils/                         # Utility functions
│   ├── supabase.ts                # Supabase client
│   ├── storage.ts                 # Local storage
│   └── analytics.ts               # Data analytics
│
├── types/                         # TypeScript type definitions
│   ├── goal.ts
│   ├── session.ts
│   ├── achievement.ts
│   ├── user.ts
│   └── index.ts
│
└── assets/                        # Static assets
    ├── images/
    │   ├── backgrounds/           # Background images
    │   ├── badges/                # Badge icons
    │   └── borders/               # User borders
    ├── sounds/                    # Sound effects
    └── fonts/                     # Fonts
```

---

# File Naming Conventions()

### Components (`.tsx`)
| Type | Convention | Example |
|------|-----------|---------|
| Components | **PascalCase** | `Button.tsx`, `GoalCard.tsx`, `CreateGoalForm.tsx` |
| Screens | **PascalCase** + `Screen` suffix | `HomeScreen.tsx`, `TimerScreen.tsx` |
| Navigators | **PascalCase** + `Navigator` suffix | `AppNavigator.tsx`, `TabNavigator.tsx` |

### Non-Component Files (`.ts`)
| Type | Convention | Example |
|------|-----------|---------|
| Hooks | **camelCase** with `use` prefix | `useTimer.ts`, `useGoals.ts` |
| Stores (Zustand) | **camelCase** with `use` prefix + `Store` suffix | `useAuthStore.ts`, `useTimerStore.ts` |
| Services | **camelCase** + `Service` suffix | `goalService.ts`, `syncService.ts` |
| Utils | **camelCase** | `supabase.ts`, `storage.ts`, `analytics.ts` |
| Types | **camelCase** | `goal.ts`, `user.ts`, `session.ts` |
| Constants | **camelCase** | `presets.ts`, `config.ts` |

### General Rules
1. **Use PascalCase** for React components (files that export JSX)
2. **Use camelCase** for utility files, hooks, services, types
3. **Be descriptive** - name should reflect the file's purpose
4. **Avoid abbreviations** - use `GoalProgress.tsx` not `GoalProg.tsx`
5. **Group related files** in folders, not with prefixes (e.g., `goals/Card.tsx` not `GoalCard.tsx` in root)