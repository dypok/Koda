# Changelog: 20-09-2026

- [Sunday]-[20/09/2026]-[00:38]-[Dylan Gamero] : Implementada HU AUTH-03 (Gestión de Perfil de Usuario y Preferencias) en el backend de apps/api. Se incorporó enmascaramiento PII de cédula en dominio (UserEntity), casos de uso GetUserProfileUseCase y UpdateUserProfileUseCase, DTOs validados con class-validator, endpoints GET y PATCH /api/v1/users/me protegidos por SupabaseAuthGuard y Swagger interactivo, manteniendo 100% de tests unitarios (6 suites, 17 tests) y 0 modificaciones en apps/web.
