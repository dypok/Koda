# Changelog: 16-10-2026

- [Friday]-[16/10/2026]-[08:17]-[Dylan Gamero] : Created branch feat/frontend-lesson-workspace-hooks from develop and resolved React Rules of Hooks violation in LessonWorkspace.tsx by hoisting all hooks (useCallback, useMemo) above conditional early returns.
- [Friday]-[16/10/2026]-[09:07]-[Dylan Gamero] : Resolved infinite toggle loop on user profile dropdown by ignoring mousedown outside clicks on the trigger button via triggerRef, decoupled level badge from avatar overflow to prevent clipping, and normalized avatar fallback to koda-classic.svg with object-cover.
- [Friday]-[16/10/2026]-[09:55]-[Dylan Gamero] : Reset initial roadmap datasets (frontend mocks and backend use-cases) to 0% progress clean initial state: only Module 01 unlocked with 0 stars, subsequent modules locked with dashed connectors.
