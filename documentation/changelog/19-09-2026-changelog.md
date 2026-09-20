# Changelog: 19-09-2026

- [Saturday]-[19/09/2026]-[22:57]-[Dylan Gamero] : Regenerated Prisma Client in apps/api to resolve TS2305 missing User export in user.mapper.ts, and updated dev script in apps/api/package.json to automatically execute prisma generate prior to starting NestJS in watch mode.
- [Saturday]-[19/09/2026]-[23:09]-[Dylan Gamero] : Resolved NestJS 'Cannot find module dist/main' error by setting rootDir to src in apps/api/tsconfig.json, routing tsBuildInfoFile into dist, and removing external @koda/types source path alias to prevent TypeScript from nesting dist/apps/api/src output.
- [Saturday]-[19/09/2026]-[23:14]-[Dylan Gamero] : Configured dual Swagger route mounting ('/api/docs' and '/docs') in apps/api/src/main.ts and URL-encoded PostgreSQL password character in apps/api/.env.
