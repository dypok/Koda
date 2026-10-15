# Changelog: 15-10-2026

- [Thursday]-[15/10/2026]-[09:18]-[Dylan Gamero] : Configured MinIO Object Storage in docker-compose.yml (ports 9000 API, 9001 Console) and added storage environment variables.
- [Thursday]-[15/10/2026]-[09:18]-[Dylan Gamero] : Implemented IObjectStorageService, MinioStorageService, SupabaseStorageService, and StorageModule in apps/api/src/infrastructure/storage.
- [Thursday]-[15/10/2026]-[09:18]-[Dylan Gamero] : Created high-efficiency vector PDF certificate generator using pdf-lib and qrcode in apps/api/src/modules/certification/pdf-generator.service.ts producing ~2.6 KB PDFs.
- [Thursday]-[15/10/2026]-[09:18]-[Dylan Gamero] : Added POST /certificates/issue, GET /certificates/verify/:code, and GET /certificates/:id/pdf binary stream endpoints in CertificationController and CertificationService.
- [Thursday]-[15/10/2026]-[09:18]-[Dylan Gamero] : Created EvaluationService in apps/web/src/services/learning/evaluation.service.ts with multi-tenant auth and proxy support.
- [Thursday]-[15/10/2026]-[09:18]-[Dylan Gamero] : Un-mocked Quiz, Exam, and Attempt Summary screens in apps/web/src/app/evaluaciones/, removing hardcoded port 3001 and cookie extraction.
- [Thursday]-[15/10/2026]-[09:18]-[Dylan Gamero] : Connected LessonWorkspace to backend evaluation and section completion endpoints.
- [Thursday]-[15/10/2026]-[09:18]-[Dylan Gamero] : Created public certificate verification screen in apps/web/src/app/verificar/[code]/page.tsx with live credential validation and PDF download.
- [Thursday]-[15/10/2026]-[09:18]-[Dylan Gamero] : Verified monorepo type safety (0 tsc errors across web and api) and ensured all 20 test suites (75 tests) pass.
- [Thursday]-[15/10/2026]-[11:04]-[Dylan Gamero] : Removed debug lock/unlock toggle buttons and HUD dev controls from RoadmapFusionView, RoadmapGraphNode, and StudentRoadmapView.
- [Thursday]-[15/10/2026]-[11:04]-[Dylan Gamero] : Replaced // separators with clean middle dot (·) indicators across roadmap cards, telemetry headers, and Pixi graph labels.
- [Thursday]-[15/10/2026]-[16:05]-[Dylan Gamero] : Merged latest develop changes (7e70f69) and resolved duplicate parameter in learning.service.ts and missing ContentModule dependency in EvaluationModule.
- [Thursday]-[15/10/2026]-[16:05]-[Dylan Gamero] : Synchronized Prisma Certificate model and CertificationService with PostgreSQL Supabase database schema (code, language_slug, track_slug, holder_name, holder_document_masked, qr_payload, pdf_sha256).
- [Thursday]-[15/10/2026]-[16:05]-[Dylan Gamero] : Verified backend runtime functionality (REST and GraphQL endpoints responding 200 OK) and confirmed 100% test pass rate (24 suites, 82 tests).
- [Thursday]-[15/10/2026]-[16:11]-[Dylan Gamero] : Verified frontend-backend contract integration and added dual code/verificationCode compatibility across EvaluationService, CertificationService, and AttemptReviewScreen; full next build passed.
