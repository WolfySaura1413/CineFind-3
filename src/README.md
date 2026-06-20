# `src/` folder structure

```
src/
├── App.tsx              # Root app component
├── screens/             # Screen components (one per file)
│   ├── HomeScreen.tsx
│   ├── SearchScreen.tsx
│   ├── TitleDetailScreen.tsx
│   ├── MyListsScreen.tsx
│   └── ProfileScreen.tsx
├── components/          # Shared UI components
│   ├── TitleCard.tsx
│   ├── StarRating.tsx
│   ├── StreamingLogos.tsx
│   ├── BottomNavBar.tsx
│   └── ...
├── hooks/               # Custom React hooks
│   ├── useSearch.ts
│   ├── useWatchlist.ts
│   ├── useAuth.ts
│   └── ...
├── services/            # API clients (abstracted)
│   ├── watchmode.ts     # Watchmode API with retry logic
│   ├── auth.ts          # Auth service (Firebase/Supabase)
│   └── db.ts            # Database operations (Firebase/Supabase)
├── store/               # Zustand global state
│   ├── authStore.ts
│   ├── listStore.ts
│   └── reviewStore.ts
└── utils/               # Helpers and constants
    ├── constants.ts     # Design tokens, strings, config
    └── helpers.ts       # Utility functions
```

## Key conventions

- **Components**: `PascalCase.tsx` with functional components + hooks only
- **Utils**: `camelCase.ts`
- **No hardcoded values**: Use `src/utils/constants.ts`
- **No direct API calls in components**: Always go through `src/services/`
- **State management**: Use Zustand in `src/store/`
- **TypeScript**: All code must be typed, no `any`
- **Styling**: Use `StyleSheet.create()`, no inline styles

## Next steps

1. Implement screens in `src/screens/`
2. Create UI components in `src/components/`
3. Implement Firebase or Supabase auth in `src/services/auth.ts`
4. Implement database operations in `src/services/db.ts`
5. Set up Expo Router navigation in `src/App.tsx`
